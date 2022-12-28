const { widget } = figma;
const { useSyncedState, usePropertyMenu, AutoLayout, Input, Frame } = widget;
const genId = (() => {
  let id = 0;
  return () => (++id).toString();
})();
interface Table {
  name: string;
  columns: Column[];
}

interface Column {
  id: string;
  name: string;
  type: string;
  marker: string;
  /**
   * Primary key or foreign key.
   */
  key: string;
}

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

function genColor(name: typeof colors[number]["name"]) {
  return colors.filter((color) => color.name === name)[0];
}

function Widget() {
  const [table, setTable] = useSyncedState<Table>("tables", {
    name: "",
    columns: [{ id: genId(), name: "", type: "", marker: "", key: "" }],
  });
  const [selectedColor, setSelectedColor] = useSyncedState<ColorType>(
    "selectedColor",
    genColor("Light Green")
  );
  const [selectedColumn, setSelectedColumn] = useSyncedState<Column>(
    "selectedColumn",
    null
  );

  const changeHeaderColor = (color: ColorType) => {
    setSelectedColor(color);
  };

  const changeTableName = (name: string) => {
    setTable({
      ...table,
      name,
    });
  };

  const getSelectedColumn = (index: number) => {
    setSelectedColumn(table.columns.find((column, i) => i === index));
  };

  const addColumn = () => {
    genId();
    setTable({
      ...table,
      columns: [
        ...table.columns,
        { id: genId(), name: "", type: "", marker: "", key: "" },
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
    console.log(index);

    if (index <= 0) {
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
        selectedOption: selectedColor.value,
        tooltip: "Table Header Color",
        propertyName: "selectedColor",
      },
      {
        itemType: "separator",
      },
      {
        itemType: "action",
        propertyName: "addColumn",
        tooltip: "Add new column",
        icon: `<svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 2.25V9.75M9.75 6H2.25" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,
      },
      {
        itemType: "action",
        propertyName: "removeColumn",
        tooltip: "Remove selected column",
        icon: `<svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.75 6H2.25" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>`,
      },
      {
        itemType: "separator",
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
      {
        itemType: "separator",
      },
      {
        itemType: "link",
        propertyName: "starAndSponsor",
        tooltip: `Star and Sponsor`,
        href: "https://github.com/logeast/figjam-uml",
        icon: `<svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.5 4.125C10.5 2.8825 9.4505 1.875 8.156 1.875C7.1885 1.875 6.3575 2.438 6 3.2415C5.6425 2.438 4.8115 1.875 3.8435 1.875C2.55 1.875 1.5 2.8825 1.5 4.125C1.5 7.735 6 10.125 6 10.125C6 10.125 10.5 7.735 10.5 4.125Z" stroke="#EC4899" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>`,
      },
    ],
    ({ propertyName, propertyValue }) => {
      if (propertyName === "selectedColor") {
        changeHeaderColor(
          colors.filter((color) => color.value === propertyValue)[0]
        );
      } else if (propertyName === "addColumn") {
        genId();
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
        fill={selectedColor.value}
        horizontalAlignItems={"start"}
        verticalAlignItems={"center"}
        width={"fill-parent"}
        height={40}
      >
        <Input
          placeholder="Table Name"
          value={table.name}
          width="fill-parent"
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
        stroke={selectedColor.value}
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
            stroke={selectedColor.value}
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
              onClick={() => getSelectedColumn(index)}
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
              fill={selectedColor.value}
              onClick={() => getSelectedColumn(index)}
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
              onClick={() => getSelectedColumn(index)}
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
                  ? selectedColor.value
                  : column.key.toUpperCase() === "FK"
                  ? genColor("Light Gray").value
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
                onClick={() => getSelectedColumn(index)}
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
