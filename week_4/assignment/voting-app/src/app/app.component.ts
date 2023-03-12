import { Component } from '@angular/core';

const QUERY_API_URL=`${process.env['BASE_VOTING_API_URL']}/query-results`

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'voting-app';

  queryResults(){
    throw new Error(QUERY_API_URL)

  }
}
