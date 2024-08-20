import { Component, ViewChild } from '@angular/core';
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';
import { DataReporting, Interimaire } from 'src/app/_core/interface/interim';
import { saledata } from 'src/app/_core/interface/salesdata';
import { MasterServiceService } from 'src/app/_core/services/master-service.service';
import { ReportingService } from 'src/app/_core/services/reporting.service';
import { MatBadgeModule } from '@angular/material/badge';
import { CommonModule } from '@angular/common';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ApexChart, ApexDataLabels, ApexNonAxisChartSeries, ApexTitleSubtitle,NgApexchartsModule } from 'ng-apexcharts';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
Chart.register(...registerables)
@Component({
  selector: 'app-reporting-rh',
  standalone: true,
  imports: [
    MatBadgeModule,
    CommonModule,
    MatProgressBarModule,
    MatCardModule,
    MatChipsModule,
    NgxChartsModule,
    NgApexchartsModule,
    CdkDropList,
    CdkDrag,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './reporting-rh.component.html',
  styleUrl: './reporting-rh.component.css'
})
export class ReportingRhComponent
{
  charData: saledata[] = []
  labelData:number[]=[]
  realData:number[]=[]
  colorData:string[]=[]
  moisActuel:string='';
  anneeActuel:any
  dataStatut:any={}
  isZoomed:boolean =true
  showDetails:boolean = false;
  showPrestat:boolean = false;
  showInterim:boolean = false;
  data:any
  view:[number,number] = [700, 370];
  showLegend = true;
  showLabels = true;
  gradient: boolean = false;
  isDoughnut: boolean = true;
  legendPosition = 'right';
  dataSource:any
  colorScheme: any = this.generateRandomColors(3);
  colorAgence:any =this.generateRandomColors(11);
  colorCategorie = this.generateRandomColors(5);
  isCommentaire:boolean=false
  dataCanal:any=[]
  dataRang:any=[]
  commentStatut:boolean = false;
  statut:boolean=false;
  commentaireStat:string =''
  commentaireCateg:string =''
  commentaireAgenc:string =''
  commentaireCan:string =''
  commentaireRan:string =''
  @ViewChild('table', {static: true}) table!: MatTable<any>;
  @ViewChild('table1', {static: true}) table1!: MatTable<any>;
  totalValue:number = 0;
  comment: boolean=false;
  commentCanal: boolean=false;
  dataCategorieGroupe: any[]=[];
  dataCategorieTotal:any
  commentCategorie:boolean = false;
  save:boolean=true;
  saveAgenc:boolean=true;
  saveCateg:boolean=true;
  saveCan:boolean=true;
  saveRan:boolean=true;
  frenchMonthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  constructor(private service: ReportingService){}
  displayedColumns: string[] = ['key','value'];
  displayedColumnsCanal: string[] = ['key', 'permanent', 'prestataire', 'interimaire','totalGeneral'];
  displayedColumnsCategorie:string[]= ['ele', 'permanent', 'prestataire','totalGeneral'];
  chartSeries: ApexNonAxisChartSeries = [];
  chartDetails: ApexChart = {
    type: 'pie',
    toolbar: {
      show: true
    }
  };
  chartBar: ApexChart = {
    type: 'bar',
    toolbar: {
      show: true
    }
  };
  chartLabels = ['Permanent','Prestataire','Interimaire'];
  chartCategorie:string[] = [];
  label:string[]=[]
  chartTitle: ApexTitleSubtitle = {
    // text: 'Leading Companies',
    align: 'center'
  };
  chartDataLabels: ApexDataLabels = {
    enabled: true
  };
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: false,
  };
  ngAfterViewInit(): void
  {
  }
  ngOnInit(): void
  {
    // this.loadCharData() 
    let date = new Date();
    let mois = date.getMonth();
    let annee = date.getFullYear();
    let moisActu = this.frenchMonthNames[mois];
    this.moisActuel = moisActu;
    this.anneeActuel = annee
    this.all()
    this.getAgence()
    this.getCategorieGroupe()
    this.getCanal();
    let comment = JSON.stringify(localStorage.getItem('commentaireStat')?.toString()!); 
    if(comment)
    {
      this.isCommentaire = true
      this.commentaireStat = comment
    }
    let commentAgen = JSON.stringify(localStorage.getItem('commentaireAgenc')?.toString()!); 
    if(commentAgen)
    {
      this.comment = true
      this.commentaireAgenc = commentAgen
    }
    let commentCateg = JSON.stringify(localStorage.getItem('commentaireCateg')?.toString()!); 
    if(commentCateg)
    {
      this.commentCategorie = true
      this.commentaireCateg = commentCateg
    }
    let commentRang = JSON.stringify(localStorage.getItem('commentaireRang')?.toString()!); 
    if(commentRang)
    {
      this.commentStatut = true
      this.commentaireRan = commentRang
    }
    let commentCan = JSON.stringify(localStorage.getItem('commentaireCan')?.toString()!); 
    if(commentCan)
    {
      this.commentCanal = true
      this.commentaireCan = commentCan
    }
  }
  // loadCharData() {
  //   this.service.loadSalesData().subscribe({
  //     next:(item=>{

  //       this.charData = item.sales;
  //       console.log(item);
        
  //       if(this.charData!=null){
  //         this.charData.map(o=>{
  //           this.labelData.push(o.year);
  //           this.realData.push(o.amount);
  //           this.colorData.push(o.colorcode);
  //         })
  //         this.renderBarChar(this.labelData,this.realData,this.colorData)
  //         this.renderPieChar(this.labelData,this.realData,this.colorData)
  //         this.renderDoughnutChar(this.labelData,this.realData,this.colorData)
  //         this.renderPaChar(this.labelData,this.realData,this.colorData)
  //         this.renderRadarChar(this.labelData,this.realData,this.colorData)
  //         this.renderLineChar(this.labelData,this.realData,this.colorData)
  //         this.renderBubbleChar(this.labelData,this.realData,this.colorData)
  //         this.renderScatteChar(this.labelData,this.realData,this.colorData)
  //       }
  //     })
  //   })
  // }
  // renderBarChar(labelData:any,valuedata:any,colordata:any){
  //   this.renderChar(labelData,valuedata,colordata,'barchart','bar');
  // }
  // renderPieChar(labelData:any,valuedata:any,colordata:any){
  //   this.renderChar(labelData,valuedata,colordata,'piechart','pie');
  // }
  // renderDoughnutChar(labelData:any,valuedata:any,colordata:any){
  //   this.renderChar(labelData,valuedata,colordata,'doughnutchart','doughnut');
  // }
  // renderPaChar(labelData:any,valuedata:any,colordata:any){
  //   this.renderChar(labelData,valuedata,colordata,'pachart','polarArea');
  // }
  // renderRadarChar(labelData:any,valuedata:any,colordata:any){
  //   this.renderChar(labelData,valuedata,colordata,'radarchart','radar');
  // }
  // renderLineChar(labelData:any,valuedata:any,colordata:any){
  //   this.renderChar(labelData,valuedata,colordata,'linechart','line');
  // }
  // renderBubbleChar(labelData:any,valuedata:any,colordata:any){
  //   this.renderChar(labelData,valuedata,colordata,'bubblechart','bubble');
  // }
  // renderScatteChar(labelData:any,valuedata:any,colordata:any){
  //   this.renderChar(labelData,valuedata,colordata,'scatterchart','scatter');
  // }
  // renderChar(labelData:any,valuedata:any,colordata:any,chartid:string,chartType:any){
  //   const myChar = new Chart(chartid,{
  //     type:chartType,
  //     data:{
  //       labels:labelData,
  //       datasets:[
  //       {
  //         label:'sales',
  //         data:valuedata,
  //         backgroundColor:colordata
  //       }]
  //     },
  //     options:{
  //       scales:{
  //         y:{
  //           beginAtZero:false
  //         }
  //       }
  //     }
  //   })
  // }
  getRandomColor()
  {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  generateRandomColors(numberOfColors:number)
  {
    const colors = [];
    for (let i = 0; i < numberOfColors; i++) {
        colors.push(this.getRandomColor());
    }
    return colors;
  }
  all()
  {
    this.service.reporting().subscribe({
      next:(response)=>{
        this.dataStatut = response.data
        console.log(this.dataStatut);
        
        let donnee=[
          this.getTotal(this.dataStatut.permanent),
          this.getTotal(this.dataStatut.prestataire),
          this.getTotal(this.dataStatut.interimaire),
        ]
        const data  ={
          interimaire:this.getTotal(this.dataStatut.interimaire),
          prestataire:this.getTotal(this.dataStatut.prestataire),
          permanent:this.getTotal(this.dataStatut.permanent)
        }
       
        this.chartSeries = donnee;
        console.log(this.chartSeries);
        
        
        
       
      }
    })
  }
  drop(event: CdkDragDrop<string>,data:any,table:any)
  {
    const previousIndex = data.findIndex((d:any) => d === event.item.data);
    moveItemInArray(data, previousIndex, event.currentIndex);
    table.renderRows();
  } 
  getAgence()
  {
    this.service.getAgence().subscribe({
      next:(response)=>{
        console.log(response);
        this.dataSource = response.data
        this.data=response.data;
        if (this.dataSource.length > 0) {
          this.dataSource = Object.keys(this.dataSource[0]).map(key => ({
            key: key,
            value: this.dataSource[0][key]
          }));
        }
        this.totalValue = this.dataSource.reduce((acc:any, item:any) => acc + item.value, 0);
        this.label = Object.keys(this.data[0]);
        this.data =Object.values(this.data[0]);
        console.log(this.data);
        
        // this.chartGraphe(this.dataSource,'piechart','bar','G RH');
      }
    })
  }
  // chartGraphe(data:any,idElement:string,typeChart:any,nom:string,couleur?:string){
  //   const myChar = new Chart(idElement,{
  //     type:typeChart,
  //     data:{
  //        labels:this.label,
  //       datasets:[
  //       {
  //         label:nom,
  //         data:Object.values(data),
  //         backgroundColor:this.generateRandomColors(3),
  //       }]
  //     },
  //     options: {
  //       plugins: {
  //         legend: {
  //           display: true,
  //           position: 'right', 
  //           labels: {
  //             boxWidth: 20, 
  //             padding: 20 
  //           }
  //         },
  //         datalabels:{
  //           formatter: (value:number, context:any) => {
  //             const dataset = context.chart.data.datasets[0];
  //             const total = dataset.data.reduce((sum:number, val:number) => sum + val, 0);
  //             const percentage = ((value / total) * 100).toFixed(2) + '%';
  //             return percentage; 
  //           },
  //           color: '#fff',
  //           anchor: 'end',
  //           align: 'start',
  //           offset: -10
  //         }
  //       }
  //     }
  //   })
  // }
  getTotal(interim:any):number
  {
    return (interim?.en_cours??0) +( interim?.terminer??0) +( interim?.rompre??0)
  }
  faireComm()
  {
    this.isCommentaire= !this.isCommentaire
    console.log(this.isCommentaire);
    
  }
  getCanal()
  {
    this.service.getCanal().subscribe({
      next:(response)=>{
        console.log(response);
        
        const transformData = Object.keys(response.data.dataCanal).map((key)=>({

          key,
          statut:false,
          ...response.data.dataCanal[key],
        }));
        this.dataCanal = transformData;
        this.dataRang= Object.keys(response.data.dataRang).map((key)=>({
          key,
          value:response.data.dataRang[key],
        }))
        console.log(this.dataCanal);
        console.log(this.dataRang);
        
        
      }
    })
  }
  commentaire()
  {
    this.comment = !this.comment
  }
  getTotalCanal(data:any):number
  {
    return (data.permanent??0)+(data.prestataire??0) +(data.interimaire??0)
  }
  getTotalForColumn(column: string,data:any): number
  {
    return data.reduce((acc:any, curr:any) => acc + (curr[column] ?? 0), 0);
  }
  getTotalGeneral(data:any): number
  {
    return this.getTotalForColumn('permanent',data) + 
           this.getTotalForColumn('prestataire',data) + 
           this.getTotalForColumn('interimaire',data);
  }
  commentaireCanl=()=>
  {
    this.commentCanal =!this.commentCanal
  }
  toggleAccordion(index:number,statut:any)
  {  
    const colindex =this.dataCanal.findIndex((ele:any) => ele.key === statut.key);
    if (index !== -1) 
    {                  
      this.dataCanal[index].statut = !statut.statut;           
    } 
  }
  getKeys(obj: any): string[] 
  {
    return Object.keys(obj);
  }
  commentaireStatut=()=>{
    this.commentStatut = !this.commentStatut
  }
  getCategorieGroupe()
  {
    this.service.getCategorieGroupe().subscribe({
      next:(response)=>{
        console.log(response);
        const transforme = Object.keys(response.data).map(ele=>({
          ele,
          ...response.data[ele]
        }))
        this.dataCategorieGroupe=transforme
        console.log(this.dataCategorieGroupe);
        let data:any =[]
        this.dataCategorieTotal = Object.keys(response.data).map(item=>{
          return this.getTotalCanal(response.data[item])
        });
        this.chartCategorie = Object.keys(response.data);
      
      console.log(this.dataCategorieTotal);
      console.log(this.chartCategorie);
      
      
      }    
    })
  }
  commentaireCategorie=()=>
  {
    this.commentCategorie =!this.commentCategorie
  }
  enregistrer=()=>
  {
    localStorage.setItem('commentaireStat',this.commentaireStat);
  }
  enregistrerAgenc=()=>
  {
    localStorage.setItem('commentaireAgenc',this.commentaireAgenc);
  }
  enregistrerCan=()=>
  {
    localStorage.setItem('commentaireCan',this.commentaireCan);
  }
  enregistrerCateg=()=>
  {
    localStorage.setItem('commentaireCateg',this.commentaireCateg);
  }
  enregistrerRan=()=>
  {
    localStorage.setItem('commentaireRan',this.commentaireRan);
  }
  activeSave(event:Event)
  {
    let rang = (event.target as HTMLTextAreaElement).value;
    this.save= rang.length <3
  }
  activeAgenc(event:Event)
  {
    let rang = (event.target as HTMLTextAreaElement).value;
      this.saveAgenc= rang.length<3
  }
  activeCateg(event:Event)
  {
    let rang = (event.target as HTMLTextAreaElement).value;
    this.saveCateg= rang.length<3 
  }
  activeCan(event:Event)
  {
    let ra = (event.target as HTMLTextAreaElement).value;
      this.saveCan= ra.length<3
  }
  activeRan(event:Event)
  {
    let rang = (event.target as HTMLTextAreaElement).value;
      this.saveRan = rang.length<3
  }

}

