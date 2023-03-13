import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const QUERY_API_URL=`${process.env['BASE_VOTING_API_URL']}/query-results`
const REQUEST_VOTE_API_URL=`${process.env['BASE_VOTING_API_URL']}/request-voting`
const GET_BALANCE_API_URL=`${process.env['BASE_VOTING_API_URL']}/get-balance`

type VotingResult = {
  proposals?: {name: string, votes: string}[],
  winner?: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  votingResult: VotingResult = {}
  balance = ''

  constructor(private http: HttpClient) {
    this.queryResults()
  }

  queryResults(){
    return this.http.get<{result: string}>(QUERY_API_URL).subscribe((result) => {
      this.votingResult = result as VotingResult
    })
  }

  getBalance(address: string){
    return this.http.get<{result: string}>(GET_BALANCE_API_URL, {params: {address}}).subscribe((result) => {
      this.balance = `${result} ETH`
    })
  }

  requestVote(address:string){
    const amount = 0.5 // ETH
    return this.http.patch<{result: string}>(REQUEST_VOTE_API_URL, {address,amount}).subscribe((result) => {})
  }
}
