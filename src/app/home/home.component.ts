import { Component, OnInit, Inject } from '@angular/core';
import { finalize, map, startWith, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { interval, Observable } from 'rxjs';

@Component({
  selector: 'dialog-overview-example-dialog',
  template: `
    <h1 mat-dialog-title>{{data.title}}</h1>
    <div mat-dialog-content>
      <p>{{data.url}}</p>
      <p>{{data.author}}</p>
      <p>{{data.created_at}}</p>
    </div>
  <div mat-dialog-actions>
    <button mat-button [mat-dialog-close]="data" cdkFocusInitial>Ok</button>
  </div>
  `,
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  quote: string | undefined;
  isLoading = false;

  storyUrl = 'https://hn.algolia.com/api/v1/search_by_date?tags=story';
  data: any;

  constructor(private http: HttpClient, public dialog: MatDialog) {}

  ngOnInit() {
    this.isLoading = true;

    // interval(10).pipe(
    //   map( () => this.getData())
    // ).subscribe(resp => resp);

    interval(10000)
      .pipe(
        startWith(0),
        switchMap(() => this.getData())
      )
      .subscribe(res => {
        this.data = res.hits;
      })
  }

  selectRow( i : number) {
    this.openDialog(this.data[i]);
  }

  openDialog(selectedData: any): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      data: selectedData
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  getData(): Observable<any> {
    return this.http.get(this.storyUrl).pipe(
        map( (resp: any) => {
          
          return resp;
        })
    )
  }
}
