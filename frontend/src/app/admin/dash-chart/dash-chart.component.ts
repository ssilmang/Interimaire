import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { saledata } from 'src/app/_core/interface/salesdata';
import { MasterServiceService } from 'src/app/_core/services/master-service.service';
import { MasterService } from 'src/app/_core/services/MasterService';
Chart.register(...registerables)
@Component({
  selector: 'app-dash-chart',
  standalone: true,
  imports: [],
  templateUrl: './dash-chart.component.html',
  styleUrl: './dash-chart.component.css'
})
export class DashChartComponent implements OnInit, AfterViewInit {
  charData: saledata[] = []
  labelData:number[]=[]
  realData:number[]=[]
  colorData:string[]=[]
  constructor(private service: MasterServiceService) {

  }
  ngAfterViewInit(): void {

  }
  ngOnInit(): void {
    this.loadCharData()
  }
  loadCharData() {
    this.service.loadSalesData().subscribe({
      next:(item=>{

        this.charData = item.sales;
        console.log(item);
        
        if(this.charData!=null){
          this.charData.map(o=>{
            this.labelData.push(o.year);
            this.realData.push(o.amount);
            this.colorData.push(o.colorcode);
          })
          this.renderBarChar(this.labelData,this.realData,this.colorData)
          this.renderPieChar(this.labelData,this.realData,this.colorData)
          this.renderDoughnutChar(this.labelData,this.realData,this.colorData)
          this.renderPaChar(this.labelData,this.realData,this.colorData)
          this.renderRadarChar(this.labelData,this.realData,this.colorData)
          this.renderLineChar(this.labelData,this.realData,this.colorData)
          this.renderBubbleChar(this.labelData,this.realData,this.colorData)
          this.renderScatteChar(this.labelData,this.realData,this.colorData)
        }
      })
    })
  }
  renderBarChar(labelData:any,valuedata:any,colordata:any){
    this.renderChar(labelData,valuedata,colordata,'barchart','bar');
  }
  renderPieChar(labelData:any,valuedata:any,colordata:any){
    this.renderChar(labelData,valuedata,colordata,'piechart','pie');
  }
  renderDoughnutChar(labelData:any,valuedata:any,colordata:any){
    this.renderChar(labelData,valuedata,colordata,'doughnutchart','doughnut');
  }
  renderPaChar(labelData:any,valuedata:any,colordata:any){
    this.renderChar(labelData,valuedata,colordata,'pachart','polarArea');
  }
  renderRadarChar(labelData:any,valuedata:any,colordata:any){
    this.renderChar(labelData,valuedata,colordata,'radarchart','radar');
  }
  renderLineChar(labelData:any,valuedata:any,colordata:any){
    this.renderChar(labelData,valuedata,colordata,'linechart','line');
  }
  renderBubbleChar(labelData:any,valuedata:any,colordata:any){
    this.renderChar(labelData,valuedata,colordata,'bubblechart','bubble');
  }
  renderScatteChar(labelData:any,valuedata:any,colordata:any){
    this.renderChar(labelData,valuedata,colordata,'scatterchart','scatter');
  }
  renderChar(labelData:any,valuedata:any,colordata:any,chartid:string,chartType:any){
    const myChar = new Chart(chartid,{
      type:chartType,
      data:{
        labels:labelData,
        datasets:[
        {
          label:'sales',
          data:valuedata,
          backgroundColor:colordata
        }]
      },
      options:{
        scales:{
          y:{
            beginAtZero:false
          }
        }
      }
    })
  }
}
