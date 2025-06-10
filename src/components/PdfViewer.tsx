export function PdfViewer({ url }: { url: string }) {
  return (
    <iframe
      src={url}
      className="w-full h-[70vh] min-h-[600px] border rounded-md shadow-lg"
      title="Form Preview"
    />
  );
}
