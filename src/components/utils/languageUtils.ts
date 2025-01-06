import { TFunction } from "i18next";
import { TaskType } from "../../features/tasks/tasksSlice";
import dayjs from "dayjs";

export const getChangeLabel = (change: string, t: TFunction) => {
  const key = change.split(": ")[0];
  switch (key) {
    case "title":
      return t("titleChange");
    case "description":
      return t("description");
    case "tags":
      return t("tagsChange");
    case "deadline":
      return t("deadline");
    case "priority":
      return t("priority");
    case "status":
      return t("status");
    default:
      return t("change");
  }
};

export const getLocalizedValue = (
  value: string,
  t: TFunction,
  field: string
) => {
  if (field === "description" || field === "title") {
    return value;
  }

  if (dayjs(value, "YYYY-MM-DD HH:mm", true).isValid()) {
    return dayjs(value).format("YYYY-MM-DD HH:mm"); //
  }

  if (t(`priorityOptions.${value}`) !== `priorityOptions.${value}`) {
    return t(`priorityOptions.${value}`);
  }

  if (t(`tags.${value}`) !== `tags.${value}`) {
    return t(`tags.${value}`);
  }

  return value;
};

export const translateTags = (tags: string, t: TFunction) => {
  if (!tags || tags.trim().length === 0) return "";
  return tags
    .split(",")
    .map((tag) => getLocalizedValue(tag.trim(), t, "tags")) //
    .join(", ");
};

export const updateTaskField = <K extends keyof TaskType>(
  task: TaskType,
  key: K,
  newValue: TaskType[K],
  changes: string[]
): boolean => {
  const oldValue = task[key];

  const isEmptyValue = (value: any) => {
    if (typeof value === "string") {
      return value.trim() === "";
    } else if (Array.isArray(value)) {
      return value.length === 0;
    }
    return false;
  };

  const isDescriptionField = key === "description" || key === "title";

  if (
    newValue !== undefined &&
    newValue !== oldValue &&
    !isEmptyValue(newValue) &&
    JSON.stringify(newValue) !== JSON.stringify(oldValue)
  ) {
    const formatValue = (value: any, isDescription: boolean) => {
      if (dayjs(value).isValid() && !isDescription) {
        return dayjs(value).format("YYYY-MM-DD HH:mm");
      }
      return value;
    };

    const formattedOldValue = formatValue(oldValue, isDescriptionField);
    const formattedNewValue = formatValue(newValue, isDescriptionField);

    const change = `${key}: ${formattedOldValue} → ${formattedNewValue}`;
    changes.push(change);
    task[key] = newValue;
    return true;
  }
  return false;
};
