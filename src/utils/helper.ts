import { DataItem } from "@/components/ui/table";

export const convertToDataItem = <T>(data: T[], transformer?: (item: T) => DataItem): DataItem[] => {
    if (typeof transformer === "function") {
        return data.map(transformer);
    }
    else return data.map((item: T) => ({
        ...item
    })) as DataItem[];
}

const colorPalette = ["red", "blue", "green", "yellow", "purple", "orange"]

export const pickPalette = (name: string) => {
    const index = name.charCodeAt(0) % colorPalette.length
    return colorPalette[index]
}