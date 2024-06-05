import { CommonModule, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Images } from 'docs/assets/data/images';
import { Interim } from 'src/app/_core/interface/interim';
import { InterimService } from 'src/app/_core/services/interim.service';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { ModalModule } from 'src/app/shared/components/modal/modal.module';
import { pageTransition } from 'src/app/shared/utils/animations';
import { environment } from 'src/environments/environment.development';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ModalModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  animations: [pageTransition]
})
export class DashboardComponent implements OnInit {
  eventDate: any = formatDate(new Date(), 'MMM dd, yyyy', 'en');
  dataInterims:Interim[]=[]
  showModal: boolean = false;
  interimaire?:Interim 
  modalCompnent: ModalComponent;
  public userOne: string = Images.users.userOne;
  apiImag=environment.apiImg;
  shorting: boolean = false;

  
  constructor(private service:InterimService){
    this.modalCompnent = new ModalComponent();
  }
  ngOnInit(): void {
    // var myChart = new Chart("areaWiseSale", {
    //   type: 'doughnut',
    //   data: {
    //     labels: ['Red', 'Blue', 'Yellow', 'Green'],
    //     datasets: [{
    //       label: '# of Votes',
    //       data: [12, 19, 3, 5],
    //       backgroundColor: [
    //         'rgba(255, 99, 132, 0.2)',
    //         'rgba(54, 162, 235, 0.2)',
    //         'rgba(255, 206, 86, 0.2)',
    //         'rgba(75, 192, 192, 0.2)',
    //       ],
    //     }]
    //   },
    //   options: {
    //     scales: {
    //       x: {
    //         display: false
    //       },
    //       y: {
    //         display: false
    //       },
    //     },
    //     plugins: {
    //       legend: {
    //         position: 'right',
    //         align: 'center',
    //       },
    //     },
    //   },
    // });
    this.index()
  }
  index()
  {
    this.service.index().subscribe({
      next:(response=>{
        console.log(response);
        this.dataInterims = response.data.interimaires
        
      })
    })
  }
  openModal(interim :Interim) {
    this.showModal = !this.showModal;
    this.interimaire = interim
    
  }

  onModalCloseHandler(event: boolean) {
    this.showModal = event;
  }
  sortingUp() {
    this.shorting = !this.shorting;
  }
  sortingDown() {
    this.shorting = !this.shorting;
  }
}
