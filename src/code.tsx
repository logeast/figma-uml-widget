const { widget } = figma;
const { useSyncedState, usePropertyMenu, AutoLayout, Input, useEffect } =
  widget;
interface Table {
  name: string;
  columns: Column[];
}

interface Column {
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

/**
 * Generate Color from color's name
 * @param name
 * @returns ColorType
 */
function genColor(name: typeof colors[number]["name"]) {
  return colors.filter((color) => color.name === name)[0];
}

function Widget() {
  const [table, setTable] = useSyncedState<Table>("tables", {
    name: "",
    columns: [{ name: "", type: "", marker: "", key: "" }],
  });
  const [tableCode, setTableCode] = useSyncedState("tableCode", "");
  const [selectedColor, setSelectedColor] = useSyncedState<ColorType>(
    "selectedColor",
    genColor("Light Green")
  );
  const [selectedColumn, setSelectedColumn] = useSyncedState<Column>(
    "selectedColumn",
    null
  );

  useEffect(() => {
    figma.ui.onmessage = (message) => {
      setTable(message.tableData);
      setTableCode(message.tableCode);
    };
  });

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
    setTable({
      ...table,
      columns: [...table.columns, { name: "", type: "", marker: "", key: "" }],
    });
  };

  const removeColumn = (index: number) => {
    setTable({
      ...table,
      columns: table.columns.filter((_, i) => i !== index),
    });
  };

  const upColumn = (index: number) => {
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

  const editCode = () => {
    return new Promise((resolve) => {
      figma.showUI(__html__, {
        width: 400,
        height: 360,
        title: "UML Table Code Editor",
        themeColors: true,
      });
      figma.ui.postMessage({ tableData: table, selectedColor });
    });
  };

  const copyCode = () => {};
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
        tooltip: "Table theme color",
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
        tooltip: "Move up column",
        icon: `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.25 5.25L6 1.5M6 1.5L9.75 5.25M6 1.5V10.5" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>`,
      },
      {
        itemType: "action",
        propertyName: "downColumn",
        tooltip: "Move down column",
        icon: `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.75 6.75L6 10.5M6 10.5L2.25 6.75M6 10.5V1.5" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>`,
      },
      {
        itemType: "separator",
      },
      {
        itemType: "action",
        propertyName: "editCode",
        tooltip: "Edit source code",
        icon: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.3125 5.6875L9.625 7L8.3125 8.3125M5.6875 8.3125L4.375 7L5.6875 5.6875M3.5 11.8125H10.5C10.8481 11.8125 11.1819 11.6742 11.4281 11.4281C11.6742 11.1819 11.8125 10.8481 11.8125 10.5V3.5C11.8125 3.1519 11.6742 2.81806 11.4281 2.57192C11.1819 2.32578 10.8481 2.1875 10.5 2.1875H3.5C3.1519 2.1875 2.81806 2.32578 2.57192 2.57192C2.32578 2.81806 2.1875 3.1519 2.1875 3.5V10.5C2.1875 10.8481 2.32578 11.1819 2.57192 11.4281C2.81806 11.6742 3.1519 11.8125 3.5 11.8125Z" stroke="white" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>`,
      },
      // {
      //   itemType: "action",
      //   propertyName: "copyCode",
      //   tooltip: "Copy source code",
      //   icon: `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      //         <path d="M4.125 3.75V3.054C4.125 2.4865 4.5475 2.005 5.113 1.958C5.2995 1.943 5.487 1.9295 5.6745 1.918M7.875 9H9C9.29837 9 9.58452 8.88147 9.7955 8.6705C10.0065 8.45952 10.125 8.17337 10.125 7.875V3.054C10.125 2.4865 9.7025 2.005 9.137 1.958C8.94999 1.94249 8.76281 1.92916 8.5755 1.918M7.875 9.375V8.4375C7.875 7.98995 7.69721 7.56073 7.38074 7.24426C7.06427 6.92779 6.63505 6.75 6.1875 6.75H5.4375C5.28832 6.75 5.14524 6.69074 5.03975 6.58525C4.93426 6.47976 4.875 6.33668 4.875 6.1875V5.4375C4.875 4.98995 4.69721 4.56073 4.38074 4.24426C4.06427 3.92779 3.63505 3.75 3.1875 3.75H2.625M8.575 1.918C8.50399 1.68835 8.36131 1.48747 8.16787 1.34477C7.97443 1.20207 7.74038 1.12506 7.5 1.125H6.75C6.50962 1.12506 6.27557 1.20207 6.08213 1.34477C5.88869 1.48747 5.74601 1.68835 5.675 1.918M8.575 1.918C8.6075 2.023 8.625 2.1345 8.625 2.25V2.625H5.625V2.25C5.625 2.1345 5.6425 2.023 5.675 1.918M3.375 3.75H2.4375C2.127 3.75 1.875 4.002 1.875 4.3125V10.3125C1.875 10.623 2.127 10.875 2.4375 10.875H7.3125C7.623 10.875 7.875 10.623 7.875 10.3125V8.25C7.875 7.05653 7.40089 5.91193 6.55698 5.06802C5.71307 4.22411 4.56847 3.75 3.375 3.75V3.75Z" stroke="white" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>
      //         </svg>`,
      // },
      {
        itemType: "separator",
      },
      {
        itemType: "link",
        propertyName: "starAndSponsor",
        tooltip: `Star or sponsor`,
        href: "https://github.com/logeast/figjam-uml",
        icon: `<svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.5 4.125C10.5 2.8825 9.4505 1.875 8.156 1.875C7.1885 1.875 6.3575 2.438 6 3.2415C5.6425 2.438 4.8115 1.875 3.8435 1.875C2.55 1.875 1.5 2.8825 1.5 4.125C1.5 7.735 6 10.125 6 10.125C6 10.125 10.5 7.735 10.5 4.125Z" stroke="#EC4899" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>`,
      },
    ],
    async ({ propertyName, propertyValue }) => {
      switch (propertyName) {
        case "selectedColor":
          changeHeaderColor(
            colors.filter((color) => color.value === propertyValue)[0]
          );
          break;
        case "addColumn":
          addColumn();
          break;
        case "removeColumn":
          removeColumn(
            table.columns.findIndex(
              (column) => column.name === selectedColumn.name
            )
          );
          break;
        case "upColumn":
          upColumn(
            table.columns.findIndex(
              (column) => column.name === selectedColumn.name
            )
          );
          break;
        case "downColumn":
          downColumn(
            table.columns.findIndex(
              (column) => column.name === selectedColumn.name
            )
          );
          break;
        case "editCode":
          await editCode();
          break;
        case "copyCode":
          break;
        default:
          break;
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
