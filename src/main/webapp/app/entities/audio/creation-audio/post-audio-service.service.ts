import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Data } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  constructor(private httpClient: HttpClient) {}

  public uploadfile(file: File): Data {
    const formParams = new FormData();
    formParams.append('file', file);
    return this.httpClient.post('http://localhost:9000/uploadFile', formParams);
  }
}
