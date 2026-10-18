export const exportRecords = (records) => {
    const text = JSON.stringify(records, null, 2);
    const blob = new Blob([text], {typer: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "finance-records.json";
    a.click();
    URL.revokeObjectURL;
};