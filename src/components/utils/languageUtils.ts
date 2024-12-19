import { TFunction } from "i18next";
import { TaskType } from "../../features/tasks/tasksSlice";

export const getChangeLabel = (change: string, t: TFunction) => {
  if (change.startsWith("title:")) {
    return t("titleChange");
  } else if (change.startsWith("tags:")) {
    return t("tagsChange");
  } else if (change.startsWith("priority:")) {
    return t("priorityChange");
  }
  return t("change");
};

export const getLocalizedValue = (value: string, t: TFunction) => {
  if (t(`priorityOptions.${value}`) !== `priorityOptions.${value}`) {
    return t(`priorityOptions.${value}`);
  }

  if (t(`tags.${value}`) !== `tags.${value}`) {
    return t(`tags.${value}`);
  }

  return value;
};

export const translateTags = (tags: string, t: TFunction) => {
  return tags
    .split(",")
    .map((tag) => getLocalizedValue(tag.trim(), t))
    .join(", ");
};

export const updateTaskField = <K extends keyof TaskType>(
  task: TaskType,
  key: K,
  newValue: TaskType[K],
  changes: string[]
) => {
  const oldValue = task[key];
  if (newValue !== undefined && newValue !== oldValue) {
    const change = `${key}: ${oldValue} → ${newValue}`;
    changes.push(change);
    task[key] = newValue;
  }
};
