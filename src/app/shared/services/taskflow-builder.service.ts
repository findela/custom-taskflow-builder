import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import Toastify from 'toastify-js';

@Injectable({
  providedIn: 'root',
})
export class TaskflowBuilderService {

  constructor(private http: HttpClient) {}

  /**
   * Return Node Catalogue List
   */
  async fetchNodeCatalogue(): Promise<any> {
    return this.http.get(environment.mockApiUrl + '/node/list')
      .toPromise()
      .then((response) => {
        response['flag'] = (response['code'] === 200);
        return response;
      })
      .catch((error) => {
        return error.message;
      });
  }

  /**
   * Return Dummy Taskflow
   */
  async dummyTaskflowData(): Promise<any> {
    return this.http.get(environment.mockApiUrl + '/dummy-taskflow')
      .toPromise()
      .then((response) => {
        response['flag'] = (response['code'] === 200);
        return response;
      })
      .catch((error) => {
        return error.message;
      });
  }

  /**
   * Return Random Color - HEXADECIMAL
   */
  getRandomColor() {
    const letters = 'BCDEF'.split('');
    let color = '#';
    for (let i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
  }

  /**
   * Toaster display utility service (Error)
   */
  public handleError(error: any): Promise<any> {
    return Toastify({
      text: error,
      duration: 6000,
      close: true,
      // destination: 'https://github.com/apvarun/toastify-js',
      newWindow: true,
      avatar: 'https://cdn-icons-png.flaticon.com/512/929/929416.png',
      gravity: 'bottom',
      position: 'center',
      className: 'danger shadow-lg font-weight-bolder ',
      stopOnFocus: true,
      onClick(): any {},
    }).showToast();
  }

  public handleSuccess(success: any): Promise<any> {
    return Toastify({
      text: success,
      duration: 5000,
      close: true,
      avatar: 'https://cdn-icons-png.flaticon.com/512/845/845646.png',
      gravity: 'bottom',
      position: 'center',
      className: 'success shadow-lg font-weight-bolder ',
      stopOnFocus: true,
      onClick(): any {},
    }).showToast();
  }
}
