import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  // _id
  // title - string
  // price - number
  // description - string
  // category - string
  // purchased_on - date - first billing date - how much old it is
  // owner - 1 / 2 / 3...
  // photos - [ urls ]
  // thumbnail_url - string
  // thumbnail_uploaded: boolean
  // active: boolean
  // created_on - date
  // updated_on - date
  // expire_on - date (30 days max after created)
  // closed_on - date
  products: any = [{id: 1, title: 'i20 Magna', price: '5,70,000', description: 'Car for Sale', category: 'Car', purchased_on: '23 Aug 2019', owner: 1, photos: [], thumbnail_url: '', thumbnail_uploaded: false, active: true, created_on: '2 Sep 2021', updated_on: null, expire_on: '2 Oct 2022', closed_on: null, location: {city: 'Hisar', state: 'Haryana'}}];

  constructor() { }

  ngOnInit() {
  }

}
