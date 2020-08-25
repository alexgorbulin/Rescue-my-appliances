import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from "rxjs/operators";
import { ImageService } from '../../shared/image.service';
import { LoginService } from '../../login/login.service';



@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styles: []
})
export class ImageComponent implements OnInit {
  // to share id between user and image components
  message: string;
  // variable for preview image placeholder
  imgSrc: string;
  // assigning selected image to selectedImage viriable
  selectedImage: any = null;
  // variable to verify if form submitted
  isSubmitted: boolean;
  // creacting the form 
  // inside the FormGroup constructor we will pass the filds of the form
  // makeing caption a required paramiter by putting a second parameter in the FormControl constructor
  formTemplate = new FormGroup({
    caption: new FormControl('', Validators.required),
    category: new FormControl(''),
    imageUrl: new FormControl('', Validators.required),

  })
  // ingecting angular firebase storage inside this component
  constructor(private storage: AngularFireStorage, private service: ImageService, private _loginService: LoginService) { }

  ngOnInit(): void {
    this.resetForm();

  }
  // define function showPreview for handeling image change event
  showPreview(event: any) {
    // check if we have image for upload or not
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      // defining onload events and assigning new value to imgSrc if something is choosen
      reader.onload = (e: any) => this.imgSrc = e.target.result;
      // trigering this onload function
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage = event.target.files[0];
    } else {
      // if no image were selected
      this.imgSrc = "/assets/img/placeholder.png";
      this.selectedImage = null;
    }
  }
  onSubmit(formValue) {
    this.isSubmitted = true;
    // check if this form is valid
    if (this.formTemplate.valid) {
      // creating the path for firebase storage 
      var filePath = `${formValue.category}/${this.selectedImage.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
      // var filePath = 'users/' + this._loginService.loggedInUser + '/clients/' + this.id + '/';
      const fileRef = this.storage.ref(filePath);
      // upload(filePath, this.selectedImage) - will give us responce. In order to 
      // work with this responce we need to call snapshotChanges function -> this will return a streen of data
      // which is observable, now we need to subcribe to it to receive the data
      //we need to work with responce and we using pipe and finalize function
      this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
        // finalize function will be called when upload 100% complete
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            formValue['imageUrl'] = url;
            // inserting caption inside the realtime database
            // this.service.insertImageDetails(formValue);
            this.resetForm();
          })
        })
      ).subscribe();
    }
  }
  // to retrive the form values from check if it pass validation
  // in order to call this function from html we have to add prefix get
  get formControls() {
    return this.formTemplate['controls'];
  }
  resetForm() {
    this.formTemplate.reset();
    this.formTemplate.setValue({
      caption: '',
      imageUrl: '',
      category: 'Animal'
    });
    this.imgSrc = "/assets/img/placeholder.png";
    this.selectedImage = null;
    this.isSubmitted = false;
  }
}
