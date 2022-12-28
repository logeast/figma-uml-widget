const { widget } = figma;
const { useSyncedState, usePropertyMenu, AutoLayout, Input } = widget;

type ColorType = { name: string; value: string };

const colors: ColorType[] = [
  // { name: "Gray", value: "#6B7280" },
  { name: "Red", value: "#EF4444" },
  { name: "Yellow", value: "#F59E0B" },
  { name: "Green", value: "#10B981" },
  { name: "Blue", value: "#3B82F6" },
  { name: "Indigo", value: "#6366F1" },
  { name: "Purple", value: "#8B5CF6" },
  { name: "Pink", value: "#EC4899" },
  { name: "Light Gray", value: "#9CA3AF" },
  { name: "Light Red", value: "#F87171" },
  { name: "Light Yellow", value: "#FBBF24" },
  { name: "Light Green", value: "#34D399" },
  { name: "Light Blue", value: "#60A5FA" },
  { name: "Light Indigo", value: "#818CF8" },
  { name: "Light Purple", value: "#A78BFA" },
  { name: "Light Pink", value: "#F472B6" },
];

function genColorValue(name: typeof colors[number]["name"]) {
  return colors.filter((color) => color.name === name)[0];
}

function Widget() {
  const [table, setTable] = useSyncedState<Database.Table>("tables", {
    name: "",
    columns: [],
  });
  const [headerColor, setHeaderColor] = useSyncedState<ColorType>(
    "headerColor",
    genColorValue("Light Green")
  );
  const [selectedColumn, setSelectedColumn] = useSyncedState<Database.Column>(
    "selectedColumn",
    null
  );

  const changeHeaderColor = (color: ColorType) => {
    console.log("color", color);

    setHeaderColor(color);
  };

  const changeTableName = (name: string) => {
    setTable({
      ...table,
      name,
    });
  };

  const addColumn = () => {
    setTable({
      ...table,
      columns: [
        ...table.columns,
        { name: "", type: "string", marker: "", key: "" },
      ],
    });
  };

  const removeColumn = (index: number) => {
    setTable({
      ...table,
      columns: table.columns.filter((_, i) => i !== index),
    });
  };

  const upColumn = (index: number) => {
    if (index === 0) {
      return;
    }

    const columns = table.columns;
    const column = columns[index];
    columns[index] = columns[index - 1];
    columns[index - 1] = column;
    setTable({
      ...table,
      columns,
    });
  };

  const downColumn = (index: number) => {
    if (index === table.columns.length - 1) {
      return;
    }

    const columns = table.columns;
    const column = columns[index];
    columns[index] = columns[index + 1];
    columns[index + 1] = column;
    setTable({
      ...table,
      columns,
    });
  };

  const changeColumnName = (index: number, name: string) => {
    setTable({
      ...table,
      columns: table.columns.map((column, i) =>
        i === index ? { ...column, name } : column
      ),
    });
  };

  const changeColumnType = (index: number, type: string) => {
    setTable({
      ...table,
      columns: table.columns.map((column, i) =>
        i === index ? { ...column, type } : column
      ),
    });
  };

  const changeColumnMarker = (index: number, marker: string) => {
    setTable({
      ...table,
      columns: table.columns.map((column, i) =>
        i === index ? { ...column, marker: marker } : column
      ),
    });
  };

  const changeColumnKey = (index: number, key: string) => {
    setTable({
      ...table,
      columns: table.columns.map((column, i) =>
        i === index ? { ...column, key } : column
      ),
    });
  };

  usePropertyMenu(
    [
      {
        itemType: "color-selector",
        options: colors.map((color) => ({
          tooltip: color.name,
          option: color.value,
        })),
        selectedOption: headerColor.value,
        tooltip: "Table Header Color",
        propertyName: "headerColor",
      },
      {
        itemType: "action",
        propertyName: "addColumn",
        tooltip: "Add column",
      },
      // @ts-ignore
      ...(table.columns.length > 0
        ? [
            {
              itemType: "separator",
            },
            {
              itemType: "dropdown",
              propertyName: "selectColumn",
              options: table.columns.map((column, index) => ({
                option: column.name,
                label: column.name,
              })),
              tooltip: "Select column",
              selectedOption: selectedColumn
                ? selectedColumn.name
                : table.columns[table.columns.length - 1].name,
            },
            {
              itemType: "action",
              propertyName: "removeColumn",
              tooltip: "Remove column",
            },
            {
              itemType: "action",
              propertyName: "upColumn",
              tooltip: "↑",
            },
            {
              itemType: "action",
              propertyName: "downColumn",
              tooltip: "↓",
            },
          ]
        : []),
    ],
    ({ propertyName, propertyValue, ...others }) => {
      console.log({ propertyName, propertyValue, ...others });

      if (propertyName === "headerColor") {
        changeHeaderColor(
          colors.filter((color) => color.value === propertyValue)[0]
        );
      } else if (propertyName === "addColumn") {
        addColumn();
      } else if (propertyName === "selectColumn") {
        setSelectedColumn(
          table.columns.find((column) => column.name === propertyValue)
        );
      } else if (propertyName === "removeColumn") {
        removeColumn(
          table.columns.findIndex(
            (column) => column.name === selectedColumn.name
          )
        );
      } else if (propertyName === "upColumn") {
        upColumn(
          table.columns.findIndex(
            (column) => column.name === selectedColumn.name
          )
        );
      } else if (propertyName === "downColumn") {
        downColumn(
          table.columns.findIndex(
            (column) => column.name === selectedColumn.name
          )
        );
      }
    }
  );

  return (
    <AutoLayout
      direction={"vertical"}
      cornerRadius={{ topLeft: 5, topRight: 5 }}
      width={360}
      height={"hug-contents"}
    >
      <AutoLayout
        direction={"horizontal"}
        padding={{ horizontal: 10, vertical: 7 }}
        fill={headerColor.value}
        horizontalAlignItems={"start"}
        verticalAlignItems={"center"}
        width={"fill-parent"}
        height={40}
      >
        <Input
          placeholder="Table Name"
          value={table.name}
          fontFamily={"Work Sans"}
          fontSize={16}
          fontWeight={"semi-bold"}
          lineHeight={"130%"}
          fill={"#FFFFFF"}
          onTextEditEnd={({ characters }) => changeTableName(characters)}
        />
      </AutoLayout>
      <AutoLayout
        direction="vertical"
        width={"fill-parent"}
        stroke={"#CCCCCC"}
        strokeWidth={1}
        strokeAlign={"inside"}
      >
        {table.columns.map((column, index) => (
          <AutoLayout
            direction="horizontal"
            key={index}
            fill={"#FFFFFF"}
            spacing={15}
            width={"fill-parent"}
            padding={{ horizontal: 10, vertical: 7 }}
            verticalAlignItems={"center"}
            stroke={"#CCCCCC"}
            strokeWidth={1}
            strokeAlign={"center"}
          >
            <Input
              placeholder="Column Name"
              value={column.name}
              fontFamily={"IBM Plex Mono"}
              fontSize={14}
              fontWeight={"normal"}
              width={"fill-parent"}
              fill={"#000000"}
              onTextEditEnd={({ characters }) =>
                changeColumnName(index, characters)
              }
            />
            <Input
              placeholder="Column Type"
              value={column.type}
              fontFamily={"IBM Plex Mono"}
              fontSize={14}
              fontWeight={"normal"}
              width={105}
              fill={"#F17400"}
              onTextEditEnd={({ characters }) =>
                changeColumnType(index, characters)
              }
            />
            <Input
              value={column.marker}
              fontFamily={"IBM Plex Mono"}
              fontSize={14}
              fontWeight={"normal"}
              width={35}
              fill={"#000000"}
              onTextEditEnd={({ characters }) =>
                changeColumnMarker(index, characters)
              }
            />
            <AutoLayout
              direction="horizontal"
              width={"hug-contents"}
              padding={{ horizontal: 6.5, vertical: 6.5 }}
              horizontalAlignItems={"center"}
              verticalAlignItems={"center"}
              fill={
                column.key.toUpperCase() === "PK"
                  ? "#F9D745"
                  : column.key.toUpperCase() === "FK"
                  ? "#C87ACD"
                  : ""
              }
              cornerRadius={9999}
            >
              <Input
                value={column.key}
                fontFamily={"IBM Plex Mono"}
                fontSize={10}
                fontWeight={"semi-bold"}
                width={12}
                fill={
                  column.key.toUpperCase() === "PK" ||
                  column.key.toUpperCase() === "FK"
                    ? "#FFFFFF"
                    : "#000000"
                }
                textCase={"upper"}
                horizontalAlignText={"center"}
                verticalAlignText={"center"}
                onTextEditEnd={({ characters }) =>
                  changeColumnKey(index, characters)
                }
              />
            </AutoLayout>
          </AutoLayout>
        ))}
      </AutoLayout>
    </AutoLayout>
  );
}

widget.register(Widget);
