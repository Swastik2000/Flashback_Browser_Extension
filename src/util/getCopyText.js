export default (list) => `\
Green:
${
  list.greenItems.length === 0
    ? "- None"
    : list.greenItems.map((item) => `- ${item.body}`).join("\n")
}

Yellow:
${
  list.yellowItems.length === 0
    ? "- None"
    : list.yellowItems.map((item) => `- ${item.body}`).join("\n")
}

Red:
${
  list.redItems.length === 0
    ? "- None"
    : list.redItems.map((item) => `- ${item.body}`).join("\n")
}`;
