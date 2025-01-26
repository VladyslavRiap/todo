import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../store/store";
import {
  checkDeadlines,
  updateTaskStatusApi,
} from "../features/tasks/tasksSlice";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { useSnackbarContext } from "../contexts/SnackBarContext";

export const DeadlineNotifier: React.FC = () => {
  const dispatch = useAppDispatch();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const { t } = useTranslation();
  const [shownNotifications, setShownNotifications] = useState<
    Record<string, number>
  >({});

  const { showMessage } = useSnackbarContext();

  const checkAndNotify = () => {
    const now = dayjs();
    const today = dayjs().format("YYYY-MM-DD");

    tasks.forEach((task) => {
      const minutesToDeadline = dayjs(task.deadline).diff(now, "minute");

      if (minutesToDeadline < 0 && task.status !== "expired") {
        dispatch(updateTaskStatusApi({ id: task.id, status: "expired" }));
      }

      if (task.status === "deferred" && task.deferredDate === today) {
        dispatch(updateTaskStatusApi({ id: task.id, status: "todo" }));
      }

      if (
        (minutesToDeadline === 60 ||
          minutesToDeadline === 30 ||
          minutesToDeadline < 15) &&
        dayjs(task.deadline).isAfter(now)
      ) {
        if (shownNotifications[task.id] !== minutesToDeadline) {
          showMessage(
            t("deadlineNotification", {
              title: task.title,
              minutes: minutesToDeadline,
            }),
            "warning"
          );

          setShownNotifications((prev) => ({
            ...prev,
            [task.id]: minutesToDeadline,
          }));
        }
      }
    });

    dispatch(checkDeadlines());
  };

  useEffect(() => {
    checkAndNotify();

    const interval = setInterval(() => {
      checkAndNotify();
    }, 60000);

    return () => clearInterval(interval);
  }, [dispatch, tasks, shownNotifications, showMessage, t]);

  return null;
};
