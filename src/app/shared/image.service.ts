import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  // share data between userView/user-form.component and images/image/image.component.ts
  private messageSource = new BehaviorSubject('default message');
  currentMessage = this.messageSource.asObservable();

  imageDetailList: AngularFireList<any>;
  // injecting AngularFireDatabase 
  constructor(private firebase: AngularFireDatabase) { }
  // share data between userView/user-form.component and images/image/image.component.ts
  changeMessage(message: string) {
    this.messageSource.next(message)
  }
  // initializing property imageDetailList
  getImageDetailList() {
    this.imageDetailList = this.firebase.list('imageDetails');
  }
  // in order to insert image to firebaseDB define a fucntion insertImageDetails
  insertImageDetails(imageDetails) {
    this.imageDetailList.push(imageDetails)
  }
}
