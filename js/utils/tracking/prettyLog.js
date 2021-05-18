export const prettyLog = (name, eventData) => {
  const detail = eventData?.detail || {};
  const dataJson = JSON.stringify(detail, null, 2);
  const title = `CustomEvent: ${name}`;

  const dataWidth = dataJson
    .split('\n')
    .reduce((acc, value) => (value.length >= acc ? value.length : acc), 0);
  const titleWidth = title.length;
  const width = Math.max(titleWidth, dataWidth);
  const titleLine = `  ${title.padEnd(width)}  `;
  const dataLines = dataJson.split('\n').map((x) => `  ${x.padEnd(width)}  `);

  const dataLogLines =
    dataLines.length > 1
      ? `%c${dataLines.slice(0, 1)}\n` +
        `%c${dataLines.slice(1, -1).join('\n')}\n` +
        `%c${dataLines.slice(-1)}\n`
      : `%c${dataLines[0]}\n`;
  const dataLogStyless =
    dataLines.length > 1
      ? [
          'font-family:monospace; background: #333; color: #eee; padding-top: 5px;',
          'font-family:monospace; background: #333; color: #eee;',
          'font-family:monospace; background: #333; color: #eee; padding-bottom: 10px; border-radius: 0 0 6px 6px',
        ]
      : [
          'font-family:monospace; background: #333; color: #eee; padding-top: 5px; padding-bottom: 10px; border-radius: 0 0 6px 6px',
        ];
  // eslint-disable-next-line no-console
  console.log(
    `%c${titleLine}\n` + dataLogLines,
    'font-family:monospace; background: #333; color: #eee; border-bottom: 1px solid #666; padding: 5px 0; border-radius: 6px 6px 0 0',
    ...dataLogStyless,
  );
};
