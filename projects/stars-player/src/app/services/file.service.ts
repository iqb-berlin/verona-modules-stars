import { Injectable } from '@angular/core';

export interface FileInformation {
  name: string;
  content: string;
}

@Injectable({
  providedIn: 'root'
})

export class FileService {
  static async loadFile(fileTypes: string[] = [], asBase64: boolean = false): Promise<FileInformation> {
    return new Promise<FileInformation>((resolve, reject) => {
      const fileUploadElement = document.createElement('input');
      fileUploadElement.type = 'file';
      fileUploadElement.accept = fileTypes.toString();
      fileUploadElement.addEventListener('change', event => {
        const uploadedFile = (event.target as HTMLInputElement).files?.[0];
        const reader = new FileReader();
        reader.onload = loadEvent => resolve({
          name: uploadedFile?.name as string,
          content: loadEvent.target?.result as string
        });
        reader.onerror = errorEvent => reject(errorEvent);
        if (uploadedFile) {
          asBase64 ? reader.readAsDataURL(uploadedFile) : reader.readAsText(uploadedFile);
        }
      });
      fileUploadElement.click();
    });
  }

  static loadImage(): Promise<FileInformation> {
    return FileService.loadFile(['image/*'], true);
  }

  static loadAudio(): Promise<FileInformation> {
    return FileService.loadFile(['audio/*'], true);
  }

  static loadVideo(): Promise<FileInformation> {
    return FileService.loadFile(['video/*'], true);
  }
}
