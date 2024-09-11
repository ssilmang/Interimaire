import { Component, DestroyRef, ViewChild } from '@angular/core';
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';
import { saledata } from 'src/app/_core/interface/salesdata';
import { ReportingService } from 'src/app/_core/services/reporting.service';
import { MatBadgeModule } from '@angular/material/badge';
import { CommonModule } from '@angular/common';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexNonAxisChartSeries, ApexTitleSubtitle,NgApexchartsModule } from 'ng-apexcharts';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PdfPowerpointComponent } from '../dialog/pdf-powerpoint/pdf-powerpoint.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { AlertComponent } from 'src/app/shared/components/alert/alert.component';
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
    ModalComponent,
    AlertComponent
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
  data:any=[]
  view:[number,number] = [700, 370];
  showLegend = true;
  showLabels = true;
  gradient: boolean = false;
  isDoughnut: boolean = true;
  legendPosition = 'right';
  dataSource:any
  colorScheme: any = this.generateRandomColors(3);
  colorAgence:string[] =this.generateRandomColors(10);
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
  commentDepart:boolean = false;
  commentaireDepartement:string=""
  save:boolean=true;
  saveAgenc:boolean=true;
  saveCateg:boolean=true;
  saveCan:boolean=true;
  saveRan:boolean=true;
  saveDepart:boolean = true;
  dataAgence:any[]=[]
  dataAnnee:any=[]
  dataMois:any=[];
  annee:any="";
  mois:any;
  dataDepartement:any=[]
  transformeDataDepartement:any[]=[];
  transformeDataCategorieGroupe:any[]=[];
  transformeDataRang:any[]=[];
  show:boolean =false;
  footer:boolean =false;
  couleur:string="bg-green-700  hover:bg-green-800";
  message:string = 'ftftftyftyfy';
  frenchMonthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  total:number=0;
  constructor(private service: ReportingService, public dialog:MatDialog,private crefDestroy:DestroyRef)
  {}
  displayedColumns: string[] = ['key','value'];
  displayedColumnsCanal: string[] = ['key', 'permanent', 'prestataire', 'interimaire','totalGeneral'];
  displayedColumnsCategorie:string[]= ['ele', 'permanent', 'prestataire','interimaire','totalGeneral'];
  chartSeries: ApexNonAxisChartSeries = [];
  chartDetails: ApexChart = {
    type: 'pie',
    toolbar: {
      show: true
    }
  };
  chartpie: ApexChart = {
    type: 'donut',
    toolbar: {
      show: true
    }
  };
  chartBar: ApexChart =
  {
    type: 'area',
    toolbar: {
      show: true
    }
  };
  chartLabels = ['Permanent','Prestataire','Interimaire'];
  chartCategorie:string[] = [];
  label:string[]=[]
  chartTitle: ApexTitleSubtitle = {
    align: 'center'
  };
  chartDataLabels: ApexDataLabels = {
    enabled: true,
    formatter: (val: number) => {
      const percentage = (val / this.total) * 100;
      return percentage.toFixed(2) + '%';
    },
  };
  chartSeri:ApexAxisChartSeries=[]
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: false,
  };
  ngAfterViewInit(): void
  {
  }
  ngOnInit(): void
  {
    let date = new Date();
    let mois = date.getMonth();
    let annee = date.getFullYear();
    let moisActu = this.frenchMonthNames[mois];
    this.moisActuel = moisActu;
    this.anneeActuel = annee;
    this.annee_mois();
    this.all();
    this.getAgence();
    this.getDepartement();
    this.getCategorieGroupe();
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
    let commentDepart = JSON.stringify(localStorage.getItem('commentaireDepartement')?.toString()!); 
    if(commentDepart)
    {
      this.commentDepart = true
      this.commentaireDepartement = commentDepart;
    }
  }
  generatePdf()
  {
    const element = document.getElementById('statut_id')as HTMLElement;
    const agence = document.getElementById('agence_id') as HTMLElement;
    const categorie_id = document.getElementById('categorie_id') as HTMLElement;
    const canal_id = document.getElementById('canal_id') as HTMLElement;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
        donnee: element,
        agence:agence,
        canal:canal_id,
        categorie:categorie_id,
        mois:this.moisActuel,
        annee:this.anneeActuel,
        dataStatut:{
          values:this.chartSeries,
          labels:this.chartLabels,
          colors:this.colorScheme,
          commentaire:this.commentaireStat
        },
        dataAgence:{
            data:this.data,
            values:this.dataAgence,
            labels:this.label,
            colors:this.colorAgence,
            commentaire:this.commentaireAgenc
        },
        dataCategorie:{
            data:this.dataCategorieGroupe,
            values:this.dataCategorieTotal,
            labels:this.chartCategorie,
            colors:this.colorCategorie,
            commentaire:this.commentaireCateg
        },
        dataCanal:{
          data:this.dataCanal,
          commentaire:this.commentaireCateg
        },
        dataDepartement:{
          data:this.dataDepartement,
          commentaire:this.commentaireDepartement
        },
        dataRang:{
          data:this.dataRang,
          commentaire:this.commentaireRan
      }
    }
    console.log(dialogConfig);
    
    this.dialog.open(PdfPowerpointComponent,dialogConfig);
  }
  validerArchive(event:string){
    if(event ==="Oui"){
      const dataStatut =Object.keys(this.dataStatut).map((key)=>({
        key,
        value:`${this.dataStatut[key]?.en_cours},${this.dataStatut[key]?.rompre},${this.dataStatut[key]?.terminer}`
      }));
      console.log(dataStatut);
      const dataAgence =this.dataSource;
      const dataDepartement = this.transformeDataDepartement;
      const dataCommentaire = {
        commentaireStat : this.commentaireStat,
        commentaireAgenc : this.commentaireAgenc,
        commentaireCateg : this.commentaireCateg,
        commentaireDepartement : this.commentaireDepartement,
        commentaireCan : this.commentaireCan,
        commentaireRang : this.commentaireRan,
      };
      const dataCategorie = this.transformeDataCategorieGroupe;
      const dataCanal = this.transformeDataRang;
      const data ={
        dataStatut:dataStatut,
        dataAgence:dataAgence,
        dataCategorie:dataCategorie,
        dataDepartement:dataDepartement,
        dataCanal:dataCanal,
        dataCommentaire:dataCommentaire,
      }
      this.service.archiveReporting(data,this.anneeActuel,this.moisActuel).pipe(takeUntilDestroyed(this.crefDestroy)).subscribe({
        next:(response)=>{
          console.log(response);
        }
      })
      this.show = !this.show
    }
    
  }
  searchArchive=(annee:string,mois:number)=>
  {
    this.service.searchArchive(annee,mois).pipe(takeUntilDestroyed(this.crefDestroy)).subscribe({
      next:(response)=>{ 
        if(response.statut===200)
        {
          if(response.data)
          {
            if(response.data.dataStatut)
            {
              this.allStatut(response.data.dataStatut);
              if(response.data.dataCommentaire.commentaireStat !=null)
              {
                this.commentaireStat = response.data.dataCommentaire.commentaireStat;
              }
            }if(response.data.dataAgence)
            {
              this.allgetAgence(response.data.dataAgence);
              if(response.data.dataCommentaire.commentaireStat!=null)
              {
                this.commentaireAgenc = response.data.dataCommentaire.commentaireAgenc;
              }
            }if(response.data.dataCategorie)
            {
              this.allgetCategorieGroupe(response.data.dataCategorie);
              if(response.data.dataCommentaire.commentaireCateg!=null)
              {
                this.commentaireCateg = response.data.dataCommentaire.commentaireCateg;
              }
            }if(response.data.dataDepartement)
            {
              this.allgetDepartement(response.data.dataDepartement);
              if(response.data.dataCommentaire.commentaireDepartement!=null)
              {
                this.commentaireDepartement = response.data.dataCommentaire.commentaireDepartement;
              }
            }if(response.data.dataCanal)
            {
              this.allgetCanal(response.data);
              if(response.data.dataCommentaire.commentaireCan)
              {
                this.commentaireCan = response.data.dataCommentaire.commentaireCan;
              }
            }
          }
        }
      }
    })
  }
  selectMois(event:Event){
    if (this.annee && this.mois) {
      console.log(this.mois);
      
      if (this.mois?.id && this.annee?.annee) {
        this.searchArchive(this.annee.annee, this.mois.id);
      }
    }
  }
  selectAnnee(event:Event)
  {
    if(this.annee && this.annee)
    {
      if(this.mois?.id && this.annee?.annee)
      {
       this.searchArchive(this.annee.annee,this.mois.id);
      }
    }
  }
  close=(event:boolean)=>{
    this.show= event
    this.footer = event;
  }
  archive=()=>{
    this.show =!this.show
    this.footer= !this.footer;
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

//   generatePdf() {
//     // const element = document.getElementById('reporting');
//     const chartElement = document.querySelectorAll('apx-chart') ;
//     // const chartImages: string[] = [];
//     // html2canvas(chartElement).then((canvas) => {
//     //   const chartImgData = canvas.toDataURL('image/png');
  
 
//     //   html2canvas(element!, { scale: 2 }).then((canvas) => {
//     //     const pdf = new jsPDF('p', 'pt', 'a4');
        
//     //     // Add the main content to the PDF
//     //     pdf.html(element!, {
//     //       callback: function (pdf) {
//     //         // Add the captured chart image at a specific position
//     //         pdf.addImage(chartImgData, 'PNG', 40, 300, 500, 300); // Adjust position and size as needed
//     //         pdf.save('reporting.pdf');
//     //       },
//     //       x: 10,
//     //       y: 10,
//     //       html2canvas: { scale: 0.5 },
//     //     });
//     //   });
//     // });
//     const element = document.getElementById('reporting');
// const chartElements =Array.from(document.querySelectorAll('apx-chart'));
// const chartImages: string[] = [];

// const captureCharts = async () => {
//   for (let ele of chartElements) {
//     const canvas = await html2canvas(ele as HTMLElement);
//     const chartImgData = canvas.toDataURL('image/png');
//     chartImages.push(chartImgData);
//   }

//   return chartImages;
// };

// captureCharts().then((chartImages) => {
//   html2canvas(element!, { scale: 2 }).then((canvas) => {
//     const pdf = new jsPDF('p', 'pt', 'a4');
    
//     // Add the main content to the PDF
//     pdf.html(element!, {
//       callback: function (pdf) {
//         // Add each captured chart image at a specific position
//         chartImages.forEach((img, index) => {
//           const positionY = 300 + (index * 310); // Adjust Y position for each chart
//           pdf.addImage(img, 'PNG', 40, positionY, 500, 300);
//         });

//         pdf.save('reporting.pdf');
//       },
//       x: 10,
//       y: 10,
//       html2canvas: { scale: 0.5 },
//     });
//   });
// });

//   }
  annee_mois()
  {
    this.service.annee_mois().pipe(takeUntilDestroyed(this.crefDestroy)).subscribe({
      next:(response)=>{
          this.dataAnnee = response.data.annee;
          this.dataMois = response.data.mois; 
          if(this.dataAnnee.length!=0){
            this.annee = this.dataAnnee.find((ele:any)=>ele.annee.toUpperCase() === this.anneeActuel.toString().toUpperCase());
          }
          if(this.dataMois.length!=0){
            this.mois = this.dataMois.find((el:any)=>el.libelle.toUpperCase() === this.moisActuel.toString().toUpperCase())
          }
          console.log(this.annee);
          console.log(this.dataAnnee);
          console.log(this.dataMois);
          
          console.log(this.mois);
          
          
      }
    })
  }
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
       this.allStatut(response.data);    
      }
    })
  }
  allStatut(response:any){
    this.dataStatut = response
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
       this.allgetAgence(response.data);
      }
    })
  }
  allgetAgence(response:any){
    this.dataSource = response
    this.data=response;
    this.dataAgence= response;
    if (this.dataSource.length > 0) {
      this.dataSource = Object.keys(this.dataSource[0]).map(key => ({
        key: key,
        value: this.dataSource[0][key]
      }));
    }
    this.totalValue = this.dataSource.reduce((acc:any, item:any) => acc + item.value, 0);
    this.label = Object.keys(this.data[0]);
    this.data =Object.values(this.data[0]);
    this.chartSeri=[{
        name:'Effectif',
        data:this.data
    }];
    this.total = this.data.reduce((acc:number, value:number) => acc + value, 0);
  }
  getDepartement()
  {
    this.service.getDepartement().pipe(takeUntilDestroyed(this.crefDestroy)).subscribe({
      next:(response)=>{
         this.allgetDepartement(response.data);
      }
    })
  }
  allgetDepartement(response:any){
    this.dataDepartement = Object.keys(response).map((key)=>({
      key,
      statut:false,
      ...response[key],
    }));
    const trasform = Object.keys(response).map((key)=>({
      key,
      value:Object.keys(response[key]).map((nexKey)=>({
        key:nexKey,
        value:response[key][nexKey]
      }))
    }))
    this.transformeDataDepartement = trasform;
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
  }
  getCanal()
  {
    this.service.getCanal().subscribe({
      next:(response)=>{ 
       this.allgetCanal(response.data);
      }
    })
  }
  allgetCanal(response:any)
  {
    const transformData = Object.keys(response.dataCanal).map((key)=>({
      key,
      statut:false,
      ...response.dataCanal[key],
    }));
    this.dataCanal = transformData;
    this.dataRang = Object.keys(response.dataRang).map((key)=>({
      key,
      value:response.dataRang[key],
    })) 
    const transf = Object.keys(response.dataRang).map((key)=>({
      key,
      value:Object.keys(response.dataCanal[key]).map(elet=>({
        key:elet,
        value:response.dataCanal[key][elet],
        dataGroupe:Object.keys(response.dataRang[key]).map((next)=>({
          key:next,
          value:response.dataRang[key][next][elet]
        }))
      })),
     
    }))
    this.transformeDataRang = transf;
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
       this.allgetCategorieGroupe(response.data)
      }    
    })
  }
  allgetCategorieGroupe(response:any)
  {
    const transforme = Object.keys(response).map(ele=>({
      ele,
      ...response[ele]
    }))
    this.transformeDataCategorieGroupe = Object.keys(response).map((key)=>({
      key,
      value:Object.keys(response[key]).map((keyNext)=>({
        key:keyNext,
        value:response[key][keyNext]
      }))
    }));
    this.dataCategorieGroupe = transforme
    this.dataCategorieTotal = Object.keys(response).map(item=>{
      return this.getTotalCanal(response[item])
    });
    this.chartCategorie = Object.keys(response);
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
  commentaireDepart(){
    this.commentDepart =!this.commentDepart
  }
  activeDepart(event:Event){
    let rang = (event.target as HTMLTextAreaElement).value;
    this.saveDepart=( rang.length<3 || rang.length==0)
  }
  enregistrerDepart(){
    localStorage.setItem('commentaireDepartement',this.commentaireDepartement);

  }
}

