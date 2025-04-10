"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
    PaginationFirstPageTrigger,
    PaginationItems,
    PaginationLastPageTrigger,
    PaginationNextTrigger,
    PaginationPrevTrigger,
    PaginationRoot,
} from "@/components/ui/pagination";
import {
    ActionBar,
    Button,
    ButtonProps,
    HStack,
    Kbd,
    Portal,
    Show,
    Stack,
    Table,
    TableRootProps,
    Text
} from "@chakra-ui/react";
import React, {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";
// Define the structure of a column in the table
export interface Column {
    key: string;
    label: string;
    render?: (item?: unknown) => React.ReactNode; // Function to render the cell content
}

// Define the structure of a data item in the table
export interface DataItem {
    id: string;
    [key: string]: React.ReactNode;
}

export interface Action extends Omit<ButtonProps, "onClick"> {
    label: React.ReactNode;
    shortcut?: React.ReactNode;
    onClick: (selected: string[]) => void;
    hideIfSelectedCountExceeds?: number;

}

// Props for the SelectableTable component
export interface SelectableTableProps extends TableRootProps {
    tablecolumns: Column[];
    data: DataItem[];
    actions?: Action[]; // Optional prop to define actions for selected items
    pageSize?: number; // Optional prop to define the number of items per page

}

const SelectableTable: React.FC<SelectableTableProps> = ({
    tablecolumns,
    data,
    pageSize = 5,
    actions,
    ...rest
}) => {
    const [selection, setSelection] = useState<string[]>([]); // State to track selected items
    const [page, setPage] = useState(1); // State to track current page

    // Reset page when data changes
    useEffect(() => {
        setPage(1);
    }, [data.length]);

    const hasSelection = selection.length > 0; // Check if any items are selected

    const indeterminate = useMemo(
        () => hasSelection && selection.length < data.length, // Determine if the checkbox should be in an indeterminate state
        [hasSelection, selection.length, data.length]
    );

    // Toggle selection of a row
    const toggleSelection = useCallback((item: string) => {
        setSelection((prev) =>
            prev.includes(item) ? prev.filter((id) => id !== item) : [...prev, item]
        );
    }, []);

    // Paginate data based on current page and page size
    const paginatedData = useMemo(
        () => data.slice((page - 1) * pageSize, page * pageSize), // Slice the data array for pagination
        [data, page, pageSize]
    );

    return (
        <Stack width="full" gap="5">
            <Table.ScrollArea>
                <Table.Root {...rest}>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader w="6">
                                <Checkbox
                                    top="1"
                                    aria-label="Select all rows"
                                    checked={indeterminate ? "indeterminate" : selection.length > 0} // Set checkbox state based on selection
                                    onCheckedChange={(changes) => {
                                        setSelection(
                                            changes.checked ? data.map((item) => item.id) : [] // Select or deselect all rows
                                        );
                                    }}
                                />
                            </Table.ColumnHeader>
                            {tablecolumns.map((col) => (
                                <Table.ColumnHeader minW={"200px"} key={col.key}>{col.label}</Table.ColumnHeader>
                            ))}
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {paginatedData.map((item, index) => (
                            <Table.Row
                                key={item.id || index}
                                data-selected={selection.includes(item.id) ? "" : undefined} // Mark row as selected if in selection
                                minW={"fit-content"}
                            >
                                <Table.Cell>
                                    <Checkbox
                                        top="1"
                                        aria-label="Select row"
                                        checked={selection.includes(item.id)} // Checkbox state for individual row
                                        onCheckedChange={() => toggleSelection(item.id)} // Toggle selection on checkbox change
                                    />
                                </Table.Cell>
                                {tablecolumns.map((col) => (
                                    <Table.Cell key={col.key}>
                                        {typeof col.render === "function"
                                            ? col.render(item)
                                            : <Text fontWeight="normal">{item[col.key]}</Text>}
                                    </Table.Cell>
                                ))}
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            </Table.ScrollArea>
            <HStack w="full" justifyContent="center">
                <PaginationRoot
                    count={data.length} // Total number of items
                    pageSize={pageSize} // Number of items per page
                    page={page} // Current page
                    onPageChange={(e) => setPage(e.page)} // Handle page change
                >
                    <PaginationFirstPageTrigger className="first-page" />
                    <PaginationPrevTrigger className="previous-page" />
                    <PaginationItems />
                    <PaginationNextTrigger className="next-page" />
                    <PaginationLastPageTrigger className="last-page" />
                </PaginationRoot>
            </HStack>
            <Show when={actions?.length}>
                <ActionBar.Root open={hasSelection}>
                    <Portal>
                        <ActionBar.Positioner>
                            <ActionBar.Content>
                                <ActionBar.SelectionTrigger>
                                    {selection.length} selected
                                </ActionBar.SelectionTrigger>
                                <ActionBar.Separator />
                                {actions?.map((action, i) => {
                                    const hide = action.hideIfSelectedCountExceeds
                                        ? selection.length > action.hideIfSelectedCountExceeds
                                        : false;
                                    return (
                                        <Button
                                            {...action}
                                            colorPalette={action.colorPalette || "primary"}
                                            variant={action.variant || "outline"}
                                            size={action.size || "sm"}
                                            key={action.label?.toString() || i}
                                            display={hide ? "none" : "block"}
                                            aria-label={action.label?.toString()}
                                            onClick={() => {
                                                action.onClick(selection); // Call action on click
                                                setSelection([]); // Clear selection after action
                                            }}
                                        >
                                            {action.label}
                                            {action.shortcut && (
                                                <Kbd ml={2}>{action.shortcut}</Kbd>
                                            )}
                                        </Button>
                                    );
                                })}
                            </ActionBar.Content>
                        </ActionBar.Positioner>
                    </Portal>
                </ActionBar.Root>
            </Show>
        </Stack>
    );
};

export default SelectableTable;
