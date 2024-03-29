import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Fichiay, IFichiay } from 'app/entities/audio/audio.model';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';
import { Observable, Observer } from 'rxjs';

export type FileLoadErrorType = 'not.image' | 'could.not.extract';

export interface FileLoadError {
  message: string;
  key: FileLoadErrorType;
  params?: any;
}

/**
 * An utility service for data.
 */
@Injectable({
  providedIn: 'root',
})
export class DataUtils {
  /**
   * Method to find the byte size of the string provides
   */
  byteSize(base64String: string): string {
    return this.formatAsBytes(this.size(base64String));
  }

  /**
   * Method to open file
   */
  openFile(data: string, contentType: string | null | undefined): void {
    contentType = contentType ?? '';

    const byteCharacters = atob(data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {
      type: contentType,
    });
    const fileURL = window.URL.createObjectURL(blob);
    const win = window.open(fileURL);
    win!.onload = function () {
      URL.revokeObjectURL(fileURL);
    };
  }

  /**
   * Sets the base 64 data & file type of the 1st file on the event (event.target.files[0]) in the passed entity object
   * and returns an observable.
   *
   * @param event the object containing the file (at event.target.files[0])
   * @param editForm the form group where the input field is located
   * @param field the field name to set the file's 'base 64 data' on
   * @param isImage boolean representing if the file represented by the event is an image
   * @returns an observable that loads file to form field and completes if sussessful
   *      or returns error as FileLoadError on failure
   */
  loadFileToForm(event: Event, editForm: FormGroup, field: string, isImage: boolean): Observable<void> {
    return new Observable((observer: Observer<void>) => {
      const eventTarget: HTMLInputElement | null = event.target as HTMLInputElement | null;
      if (eventTarget?.files?.[0]) {
        const file: File = eventTarget.files[0];
        if (isImage && !file.type.startsWith('image/')) {
          const error: FileLoadError = {
            message: `File was expected to be an image but was found to be '${file.type}'`,
            key: 'not.image',
            params: { fileType: file.type },
          };
          observer.error(error);
        } else {
          const fieldContentType: string = field + 'ContentType';
          this.toBase64(file, (base64Data: string) => {
            editForm.patchValue({
              [field]: base64Data,
              [fieldContentType]: file.type,
            });
            observer.next();
            observer.complete();
          });
        }
      } else {
        const error: FileLoadError = {
          message: 'Could not extract file',
          key: 'could.not.extract',
          params: { event },
        };
        observer.error(error);
      }
    });
  }

  ngLoadFileToForm(event: NgxDropzoneChangeEvent, editForm: FormGroup, field: string, isImage: boolean): Observable<void> {
    return new Observable((observer: Observer<void>) => {
      const file: File = event.addedFiles[0];
      if (isImage && !file.type.startsWith('image/')) {
        const error: FileLoadError = {
          message: `File was expected to be an image but was found to be '${file.type}'`,
          key: 'not.image',
          params: { fileType: file.type },
        };
        observer.error(error);
      } else {
        const fieldContentType: string = field + 'ContentType';
        this.toBase64(file, (base64Data: string) => {
          editForm.patchValue({
            [field]: base64Data,
            [fieldContentType]: file.type,
          });
          observer.next();
          observer.complete();
        });
      }
    });
  }

  NgLoadFileAudioToForm(event: NgxDropzoneChangeEvent, editForm: FormGroup, field: string): Observable<void> {
    return new Observable((observer: Observer<void>) => {
      const file: File = event.addedFiles[0];

      const fieldContentType: string = field + 'ContentType';
      const fieldNom: string = field + 'Nom';
      const fieldExt: string = field + 'Ext';
      this.toBase64(file, (base64Data: string) => {
        editForm.patchValue({
          [field]: base64Data,
          [fieldContentType]: file.type,
          [fieldNom]: file.name,
          [fieldExt]: file.name.replace(/^.*\./, ''),
        });
        observer.next();
        observer.complete();
      });
      //        }
    });
  }

  loadFileAudioToForm(event: Event, editForm: FormGroup, field: string, isImage: boolean): Observable<void> {
    return new Observable((observer: Observer<void>) => {
      const eventTarget: HTMLInputElement | null = event.target as HTMLInputElement | null;
      if (eventTarget?.files?.[0]) {
        const file: File = eventTarget.files[0];

        const fileExtension = file.name.replace(/^.*\./, '');
        // YAYA rajouter formats
        //       if(fileExtension === "mp3"){
        //       alert(" YUYUUUUUUU ");
        //       alert(file.name);
        //        }

        const fieldContentType: string = field + 'ContentType';
        const fieldExt: string = field + 'Ext';
        this.toBase64(file, (base64Data: string) => {
          editForm.patchValue({
            [field]: base64Data,
            [fieldContentType]: file.type,
            [fieldExt]: file.name.replace(/^.*\./, ''),
          });
          observer.next();
          observer.complete();
        });
        //        }
      } else {
        const error: FileLoadError = {
          message: 'Could not extract file',
          key: 'could.not.extract',
          params: { event },
        };
        observer.error(error);
      }
    });
  }

  NgLoadFichiayToFichiasse(event: NgxDropzoneChangeEvent, fichiasse: IFichiay[]): Observable<void> {
    return new Observable((observer: Observer<void>) => {
      //      const eventTarget: HTMLInputElement | null = event.target as HTMLInputElement | null;
      const files: File[] = event.addedFiles;
      //       const file: File = eventTarget.files[0];
      //       for(var  file of eventTarget.files ){
      for (let i = 0; i < files.length; i++) {
        const fifi = new Fichiay();

        this.toBase64(files[i], (base64Data: string) => {
          fifi.nom = files[i].name;
          fifi.fichier = base64Data;
          fifi.fichierContentType = files[i].type;
          (fifi.ext = files[i].name.replace(/^.*\./, '')), observer.next();
          observer.complete();
        });
        fichiasse[i] = fifi;
      }
    });
  }

  loadFichiayToFichiasse(event: Event, fichiasse: IFichiay[]): Observable<void> {
    return new Observable((observer: Observer<void>) => {
      const eventTarget: HTMLInputElement | null = event.target as HTMLInputElement | null;
      if (eventTarget?.files?.[0]) {
        //       const file: File = eventTarget.files[0];
        //       for(var  file of eventTarget.files ){
        for (let i = 0; i < eventTarget.files.length; i++) {
          const fifi = new Fichiay();

          this.toBase64(eventTarget.files[i], (base64Data: string) => {
            if (eventTarget.files?.[0]) {
              fifi.nom = 'YEUUUUSH';
              fifi.fichier = base64Data;
              fifi.fichierContentType = eventTarget.files[i].type;
              (fifi.ext = eventTarget.files[i].name.replace(/^.*\./, '')), observer.next();
              observer.complete();
            }
          });

          fichiasse[i] = fifi;
        }
      }
    });
  }

  /**
   * Method to convert the file to base64
   */
  private toBase64(file: File, callback: (base64Data: string) => void): void {
    const fileReader: FileReader = new FileReader();
    fileReader.onload = (e: ProgressEvent<FileReader>) => {
      if (typeof e.target?.result === 'string') {
        const base64Data: string = e.target.result.substring(e.target.result.indexOf('base64,') + 'base64,'.length);
        callback(base64Data);
      }
    };
    fileReader.readAsDataURL(file);
  }

  private endsWith(suffix: string, str: string): boolean {
    return str.includes(suffix, str.length - suffix.length);
  }

  private paddingSize(value: string): number {
    if (this.endsWith('==', value)) {
      return 2;
    }
    if (this.endsWith('=', value)) {
      return 1;
    }
    return 0;
  }

  private size(value: string): number {
    return (value.length / 4) * 3 - this.paddingSize(value);
  }

  private formatAsBytes(size: number): string {
    return size.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' bytes';
  }
}
