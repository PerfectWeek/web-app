export function createImageFromBlob(image: Blob, obj: any) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
        obj.image = reader.result;
    }, false);

    if (image) {
        reader.readAsDataURL(image);
    }
}