import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Images } from 'docs/assets/data/images';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import PptxGenJS from 'pptxgenjs';

@Component({
  selector: 'app-pdf-powerpoint',
  standalone: true,
  imports: [],
  templateUrl: './pdf-powerpoint.component.html',
  styleUrl: './pdf-powerpoint.component.css'
})
export class PdfPowerpointComponent
{
  donnee:any
  public userOne: string =Images.LOGO ;
  public orange:string = Images.Orange;
  public sonatel:string = Images.sonatel;
  constructor(private dialogRef: MatDialogRef<PdfPowerpointComponent>,@Inject(MAT_DIALOG_DATA) private data:any)
  {
    this.donnee =data;
  }
  close()
  {
    this.dialogRef.close();
  }
  pdf=()=>
  {
    const pdf = new jsPDF();
    pdf.setTextColor(250, 80, 18); 
    const text = `Reporting RH ${this.donnee.mois} ${this.donnee.annee}`; 
    pdf.text(text, 70, 20); 
    pdf.text(`Ce document récapitule les KPI Rh marquants durant le mois de  ${this.donnee.mois }  ${ this.donnee.annee }.`,10,30);
    pdf.text('DV/PPCO/PRC',70,40);
    pdf.setFillColor(200, 200, 200);
    pdf.roundedRect(50,50,90,10,5,5,'F');
    pdf.setFillColor(250, 80, 18); 
    pdf.roundedRect(49, 49, 90, 10,5,5, 'F');
    pdf.setFillColor(250, 80, 18); 
    pdf.setTextColor(255,255,255);
    pdf.text('Effectifs par Statut',70,56);
    const fontSize = pdf.getFontSize();
    this.donnee.dataStatut.values.forEach((ele:any,index:number)=>{
      pdf.setFillColor(200, 200, 200);
      const textWidth = pdf.getStringUnitWidth(`${ele}`) * fontSize / pdf.internal.scaleFactor;
      const textX = 20 + (index * 35) - (2);
      pdf.ellipse(textX+4 ,80,15,15,'F');
      pdf.setFillColor(250, 80, 18);
      pdf.ellipse(textX+3 ,79,15,15,'F');
      pdf.setTextColor(255,255,255);
      pdf.text(`${ele}`,textX+1,81);
      pdf.setTextColor(0,0,0);
      const label = `${this.donnee.dataStatut.labels[index]}`;
      const labelWidth = pdf.getStringUnitWidth(label) * fontSize / pdf.internal.scaleFactor;
      const labelX = textX - 8;
      const labelY = 100;
      pdf.text(label, labelX, labelY); 
      pdf.setLineWidth(0.5);
      pdf.line(labelX, labelY + 1, labelX + labelWidth, labelY + 1);
    })
    pdf.setFontSize(12);
   const commentaire = this.textCommentaire(pdf,this.donnee.dataStatut.commentaire,185,10,120);
  //  EFFECTIFS PAR AGENCE
    let lastLineY = 120+(commentaire.length * pdf.getFontSize()*0.3528);
    lastLineY +=10;
    pdf.setFillColor(200, 200, 200); 
    pdf.roundedRect(50,lastLineY,90,10,5,5,'F');
    pdf.setFillColor(250, 80, 18); 
    pdf.roundedRect(49,lastLineY-1,90,10,5,5,'F');
    pdf.setTextColor(255,255,255);
    pdf.setFontSize(16)
    pdf.text('Effectifs par Agence',70,lastLineY+6);  
    let xposition =0;
    let val=0;
    this.donnee.dataAgence.data.map((element:any,index:number) => {
      pdf.setFillColor( 200, 200, 200);
      pdf.setFontSize(10);
      let value =index;
      if (xposition > 165){
        xposition = 18;
        lastLineY +=27;
      }else{
        if(index>6){
          val++;
          index = val;
        }
        xposition=20+(index*30)-2
      }       
      pdf.ellipse(xposition,lastLineY+25,10,10,'F');
      pdf.setFillColor( 250, 80, 18);
      pdf.ellipse(xposition-1,lastLineY+24,10,10,'F');
      pdf.setTextColor(255,255,255);
      pdf.text(`${element}`,xposition-2,lastLineY+26);
      const label = `${this.donnee.dataAgence.labels[value]}`;
      const labelWidth = pdf.getStringUnitWidth(label) * fontSize / pdf.internal.scaleFactor;
      const labelX = xposition - 6;
      const labelY = lastLineY + 40;
      pdf.setTextColor(0,0,0);    
      pdf.text(label, labelX, labelY); 
      pdf.setLineWidth(0.5);
      // pdf.line(labelX, labelY + 1, labelX + labelWidth, labelY + 1);
    });
    this.canvasHtml(pdf,this.donnee.donnee,110,65,95,45).then(()=>{
      this.canvasHtml(pdf,this.donnee.agence,25,lastLineY+45,150,70).then(()=>{ 
        pdf.addPage();
        const commentaireAgenc = this.textCommentaire(pdf,this.donnee.dataAgence.commentaire,185,10,20);
        let lastY =20+(commentaireAgenc.length * pdf.getFontSize()*0.3528);
        lastY +=10;
        pdf.setFontSize(16);
        pdf.setTextColor(255, 255,255);
        pdf.setFillColor(200,200,200);
        pdf.roundedRect(50,lastY,90,10,5,5,'F');
        pdf.setFillColor(250,80,18);
        pdf.roundedRect(49,lastY-1,90,10,5,5,'F');
        pdf.text('Effectifs par Catégorie',70,lastY+6);
        pdf.setFillColor(255,255,255);
        pdf.roundedRect(8,lastY+17,190,70,1,1,'FD');
        pdf.setFillColor(200, 200, 200);
        pdf.setFillColor(255,255,255);
        pdf.setTextColor(0,0,0);
        pdf.setFontSize(12);
        const commentaireCateg = this.textCommentaire(pdf,this.donnee.dataCategorie.commentaire,185,10,lastY+100);
        console.log(commentaireCateg);
        let lastCategY = 20+(commentaireCateg.length *pdf.getFontSize()*0.3528);
        lastCategY +=10;
        pdf.setFillColor(200,200,200);
        pdf.roundedRect(50,lastCategY+110,90,10,5,5,'F');
        pdf.setFillColor(250,80,18);
        pdf.roundedRect(49,lastCategY+109,90,10,5,5,'F');
        pdf.setTextColor(255,255,255);
        pdf.setFontSize(16);
        pdf.text('Effectifs par Canal',70,lastCategY+115);
        pdf.rect(8,lastCategY+125,190,80);
        this.canvasHtml(pdf,this.donnee.categorie,8,lastY+17,190,70).then(()=>{
          this.canvasHtml(pdf,this.donnee.canal,8,lastCategY+125,190,80).then(()=>{
            pdf.addPage();
            pdf.setFontSize(12);
            pdf.setTextColor(0,0,0);
            const commentaireCanal = this.textCommentaire(pdf,this.donnee.dataCanal.commentaire,185,10,20);
            let lastCanY = 20+(commentaireCanal.length *pdf.getFontSize()*0.3528);
            lastCanY +=10;
            pdf.setFillColor(200,200,200);
            pdf.roundedRect(50,lastCanY+20,90,10,5,5,'F');
            pdf.setFillColor(250,80,18);
            pdf.roundedRect(49,lastCanY+19,90,10,5,5,'F');
            pdf.setTextColor(255,255,255);
            pdf.setFontSize(16);
            pdf.text('Effectifs par Rang',70,lastCanY+25);
            pdf.save('report.pdf'); 
          })
        })
      });
    });
    this.dialogRef.close();
  }
  textCommentaire(pdf:jsPDF,commentaire:string,taille:number,x:number,y:number)
  {
    const commentaireText = pdf.splitTextToSize(`${commentaire}`, taille);
    pdf.text(commentaireText,x,y);
    return commentaireText;
  }
  canvasHtml(pdf:jsPDF,donnee:any,x:number,y:number,w:number,h:number)
  {
    return html2canvas(donnee,{scale:2}).then((canvas)=>
    {    
      pdf.addImage(canvas.toDataURL('image/png'),'PNG',x,y,w,h);   
    })
  }
  powerPoint()
  {
      const pptx = new PptxGenJS();
      let slid= pptx.addSlide();
      slid.addImage({
        path: this.userOne,
        x:0,
        y:0,
        w:10,
        h:5.625
      });
      let slide = pptx.addSlide();
      slide.addText( `Reporting RH ${this.donnee.mois} ${this.donnee.annee}`,
      {
        // shape:pptx.ShapeType.ellipseRibbon2,
        x: 0.5,
        y: 1,
        h:1,
        w:9.5,
        fontSize: 32,
        color:'#FF7800',
        align:'center'
      //   shadow:{
      //     type: 'outer',
      //     color: "696969",
      //     blur: 3,
      //     offset: 10,
      //     angle: 60
      //   },
      //  fill: {
      //    color:'#FF7800',
      //    type:'solid'
      //   }
      });
      slide.addText(`Ce document récapitule les KPI Rh marquants durant le mois de  ${this.donnee.mois }  ${ this.donnee.annee }.`,
      {
        x:1,
        y:2.5,
        color:'#000000',
        align:'center',
        fontSize:24
      });
      slide.addText('DV/PPCO/PRC',
        {
          // shape:pptx.ShapeType.round1Rect,
          x:2.8,
          y:4.7,
          h:0.5,
          w:4,
          align:'center',
          fontSize:22,
          color:'#000000',
          // fill:{
          //   color:'#FF7800',
          //   type:'solid',
          // },
          // shadow:{
          //   type: 'outer',
          //   color: "696969",
          //   blur: 3,
          //   offset: 10,
          //   angle: 10
          // }
        });
        slide.addImage({
          path:this.orange,
          x:0.3,
          y:4.6,
          h:0.7,
          w:0.8
        })
        slide.addImage({
          path:this.sonatel,
          x:8.5,
          y:4.6,
        })
      let statut = pptx.addSlide();
      statut.addText('Effectifs par Statut',{
        // shape: pptx.ShapeType.ribbon2,
        x:1,
        y:0.3,
        h:0.5,
        align:'center',
        color:'#FF7800',
        fontSize:24
      //   shadow:{
      //     type: 'outer',
      //     color: "696969",
      //     blur: 3,
      //     offset: 10,
      //     angle: 60
      //   },
      //  fill: {
      //    color:'#FF7800',
      //    type:'solid'
      //   }
      });
      const ellipseWidth = 1.5;
      const spacing = 0.3; 
      const totalEllipseWidth = this.donnee.dataStatut.values.length * (ellipseWidth + spacing);
      this.boucle(statut,this.donnee.dataStatut.values,pptx,ellipseWidth,spacing,this.donnee.dataStatut.labels,10,1.5);
      statut.addChart(pptx.ChartType.doughnut, 
      [{
        name:'Statut',
        values:this.donnee.dataStatut.values,
        labels:this.donnee.dataStatut.labels,
        color:this.donnee.dataStatut.colors,
        
      }], 
      {
        chartColors:this.donnee.dataStatut.colors,
        x: totalEllipseWidth+spacing+0.5,
        y: 1,
        w: 3.7,
        h: 3,
        showLegend:true,
        legendFontSize:12,
        legendPos:'r',
        showPercent:true, 
        color:'#ffffff',
        dataLabelColor:'#FFFFFF'
      });
      statut.addText('Commentaires',{
        x:1,
        y:3.7,
        align:'center',
        color:'FF7800',
        underline:{style:'heavy',color:"000000"},
      })
      statut.addText(`${this.donnee.dataStatut.commentaire}`,
      {
        shape: pptx.ShapeType.round2DiagRect,
        x: 1,              
        y: 3.9,               
        w: 8,              
        h: 1.5,             
        fontSize: 14,  
        color:"000000",    
        align:'center',
        
        // shadow:{
        //   type: 'outer',
        //   color: "696969",
        //   blur: 3,
        //   offset: 10,
        //   angle: 60
        // },
       fill: {
        color:'ffffff',
         type:'solid',
        },
        line:{
          color:'000000',
          width:1.3
        } 
      });
      let agence = pptx.addSlide();
      agence.addText('Répartition des effectifs : Sonatel(Permanent), Prestataire et Interimaire',{
        // shape: pptx.ShapeType.ribbon2,
        x:0.25,
        y:0.2,
        h:0.5,
        w:10,
        color:'#FF7800',
        fontSize:20
      //  fill: {
      //    color:'#FF7800',
      //    type:'solid'
      //   },
      //   shadow:{
      //     type: 'outer',
      //     color: "696969",
      //     blur: 3,
      //     offset: 10,
      //     angle: 60
      //   },
      });
        const headers = [
          { text: 'Permanent/Interim/Prestataire', options: { bold: true, color: 'FFFFFF', fill: 'FF7800' } },
          { text: 'Effectif', options: { bold: true, color: 'FFFFFF', fill: 'FF7800' } }
        ];
        let totalArea = this.donnee.dataAgence.data.length*(ellipseWidth+spacing);
        const tableData:any = [];
        let total=0;
        tableData.push(headers); 
        const data = this.donnee.dataAgence.values[0];
        for (let [key, value] of Object.entries(data))
        {
          const numeric = value as number;
          total+= numeric;
          tableData.push([key, numeric.toString()]);
        }
        tableData.push([
          { text: 'Total', options: { bold: true, color: 'FFFFFF', fill: { color: '#FF7800' } } },
          { text: total.toString(), options: { bold: true, color: 'FFFFFF', fill: { color: '#FF7800' } } },
        ]);
        agence.addTable(tableData,{
          x: 0.5,  
          y: 1.0,  
          w: 3.0,   
          h: 0.3, 
          border:{
            type:'solid',
            pt:1,
            color:'#000000'
          }, 
          align: 'center',
          fontSize: 8,   
          fill:{
            color: 'F1F1F1' 
          }
        });
        console.log(this.donnee.dataAgence);
        
        agence.addChart(pptx.ChartType.bar, 
          [{
            name:'Agence',
            values:this.donnee.dataAgence.data,
            labels:this.donnee.dataAgence.labels,   
            color:this.donnee.dataAgence.colors,
          }], 
          {
            
            x: 3.7,
            y: 0.9,
            w: 5.7,
            h: 3.2,
            showLegend: true,
            legendFontSize: 12,
            legendPos: 'r',
            showPercent: false,
            dataLabelColor: '#FFFFFF', 
            barDir: 'col',  
          
            color:"FF7800",
            // chartArea:{fill:{color:"FF7800"}, border: { color: this.donnee.dataAgence.colors, pt: 1 }} ,
            plotArea:{fill:{color:"ffffff"}}
          });
          agence.addText("Titre : Pourcentage de l'effectif global",
            {
              x:3.3,
              y:4.1,
              color:'FF7800',
              underline:{
                style:"dash"
              },
              align:'center',
            }
          )
          agence.addText('Commentaires',{
            x:0.8,
            y:4.3,
            align:'center',
            color:'FF7800',
            underline:{style:'heavy',color:"000000"},
          })
        agence.addText(`${this.donnee.dataAgence.commentaire}`,
        {
          shape:pptx.ShapeType.round2DiagRect,
          x: 0.5,              
          y: 4.5,               
          w: 9,              
          h: 1,             
          fontSize: 14,      
          color: '#000000',      
          align:'center',
          fill: {
            color:'ffffff',
             type:'solid',
            },
            line:{
              color:'000000',
              width:1.3
            } 
        //   shadow:{
        //     type: 'outer',
        //     color: "696969",
        //     blur: 3,
        //     offset: 10,
        //     angle: 60
        //   },
        //  fill: {
        //    color:'#FF7800',
        //    type:'solid'
        //   }       
        });
        let categorie = pptx.addSlide();
        categorie.addText('Effectifs par Catégorie',{
          // shape:pptx.ShapeType.ribbon2,
          x:1,
          y:0.3,
          h:0.5,
          align:'center',
          color:'FF7800',
          fontSize:24
          // shadow:{
          //   offset:10,
          //   type:'outer',
          //   blur:3,
          //   angle:60,
          //   color:'696969'
          // },
          // fill:{
          //   color:'FF7800',
          //   type:'solid'
          // }
        })
        const dataCategorie:any=[];
        const headerCategories =[
          {text:'Catégorie',options:{bold:true,color:'FFFFFF',fill:'FF7800'}},
          {text:'Permanent',options:{bold:true,color:'FFFFFF',fill:'FF7800'}},
          {text:'Prestataire',options:{bold:true,color:'FFFFFF',fill:'FF7800'}},
          {text:'Interimaire',options:{bold:true,color:'FFFFFF',fill:'FF7800'}},
          {text:'Total',options:{bold:true,color:'FFFFFF',fill:'FF7800'}}
        ];
        dataCategorie.push(headerCategories);
        this.donnee.dataCategorie.data.forEach((row:any)=>{
          const total = row.permanent + row.prestataire+row.interimaire;
          dataCategorie.push([
          {text:row.ele},
          {text:row.permanent.toString()},
          {text:row.prestataire.toString()},
          {text:row.interimaire.toString()},
          {text:total.toString(),options:{color:'FF7800'}},
          ]);
        });
        const totalPermanent =  this.donnee.dataCategorie.data.reduce((sum:any, row:any) => sum + row.permanent, 0);
        const totalPrestataire =  this.donnee.dataCategorie.data.reduce((sum:any, row:any) => sum + row.prestataire, 0);
        const totalInterimaire=  this.donnee.dataCategorie.data.reduce((sum:any, row:any) => sum + row.interimaire, 0);
        const grandTotal = totalPermanent + totalPrestataire + totalInterimaire;
        const footerRow = [
          { text: 'Total', options: { bold: true,fill:'FF7800',color:'FFFFFF' } },
          { text: totalPermanent.toString(), options: { bold: true,fill:'FF7800',color:'FFFFFF'}},
          { text: totalPrestataire.toString(), options: { bold: true,fill:'FF7800',color:'FFFFFF'}},
          { text: totalInterimaire.toString(), options: { bold: true,fill:'FF7800',color:'FFFFFF'}},
          { text: grandTotal.toString(), options: { bold: true,fill:'FF7800',color:'FFFFFF'}}
        ];
        dataCategorie.push(footerRow);
        categorie.addTable(dataCategorie,{
          x:0.5,
          y:1.2,
          w:4.3,
          h:1,
          fontSize:10,
          align:'center',
          fill:{
            color:'F1F1F1'
          },
          border:{
            pt:1,
            type:'solid',
            color:'000000'
          }
        });
        categorie.addChart(pptx.ChartType.pie, [{
           name:'Catégorie',
          values:this.donnee.dataCategorie.values,
          labels:this.donnee.dataCategorie.labels, 
        }], 
        {
          chartColors:this.donnee.dataCategorie.colors,
          x: 4.8,
          y: 1,
          w: 5.2,
          h: 2.5,
          showLegend:true,
          legendFontSize:12,
          legendPos:'r',
          showPercent:true, 
          color:'#ffffff',
          dataLabelColor:'#FFFFFF'
        });
        categorie.addText('Commentaires',{
          x:1,
          y:3.8,
          align:'center',
          color:'FF7800',
          underline:{style:'heavy',color:"000000"},
        })
        categorie.addText(this.donnee.dataCategorie.commentaire,
        {
            shape:pptx.ShapeType.round2DiagRect,
            x:0.3,
            y:4.2,
            w:9,
            h:1.2,
            fontSize: 14,      
            align:'center',
            color:'#000000',
            fill: {
              color:'ffffff',
               type:'solid',
              },
              line:{
                color:'000000',
                width:1.3
              } 
            // shadow:{
            //   type: 'outer',
            //   color: "696969",
            //   blur: 3,
            //   offset: 10,
            //   angle: 60
            // },
            // fill: {
            //  color:'#FF7800',
            //  type:'solid'
            // }  
        });
        let text="Structure";
        const headerCanal=[
          {text:`${text}`,options:{bold:true,fill:'FF7800',color:'ffffff'}},
          {text:'Permanent',options:{bold:true,fill:'FF7800',color:'ffffff'}},
          {text:'Prestataire',options:{bold:true,fill:'FF7800',color:'ffffff'}},
          {text:'Interimaire',options:{bold:true,fill:'FF7800',color:'ffffff'}},
          {text:'Total Général',options:{bold:true,fill:'FF7800',color:'ffffff'}},
        ];
        let departement = pptx.addSlide();
        departement.addText('Effectif par Entités',
          {
            x:1,
            y:0.2,
            h:0.2,
            color:"FF7800",
            fontSize:24,
            align:'center',
          });
          let dataDepartement:any=[];
          let dataDepart = this.table(dataDepartement,headerCanal,this.donnee.dataDepartement.data);
          dataDepartement = dataDepart.dataCanal;
          let rowDepart = dataDepart.footerRow;
          departement.addTable(dataDepartement,{
            x:0.5,
            y:0.6,
            h:0.2,
            w:5,
            color:'000000',
            fill:{
              color:'F1F1F1',
              type:'solid'
            },
            align:'center',
            fontSize:12,
            border:{
              type:'solid',
              pt:1,
              color:'000000'
            }
          })
         
            departement.addText('Commentaires',{
              x:4.1,
              y:1,
              align:'center',
              color:'FF7800',
              underline:{style:'heavy',color:"000000"},
            })
            departement.addText(this.donnee.dataDepartement.commentaire,
              {
                  shape:pptx.ShapeType.round2DiagRect,
                  x:5.7,
                  y:1.2,
                  w:4,
                  h:4,
                  fontSize: 14,      
                  align:'center',
                  color:'#000000',
                  fill: {
                    color:'ffffff',
                     type:'solid',
                    },
                    line:{
                      color:'000000',
                      width:1.3
                    },
              });
        
        let canal = pptx.addSlide();
        canal.addText('Effectifs par Canal',{
          // shape:pptx.ShapeType.ribbon2,
          x:1,
          y:0.2,
          h:0.5,
          color:'FF7800',
          align:'center',
          fontSize:24
          // shadow:{
          //   type:'outer',
          //   offset:10,
          //   angle:45,
          //   color:'F1F1F1'
          // },
          // fill:{
          //   color:'FF7800',
          //   type:'solid'
          // }
        })  
        let dataCanal:any=[]
        text = "Canal";
        let donnees = this.table(dataCanal,headerCanal,this.donnee.dataCanal.data);
        dataCanal = donnees.dataCanal;
        const footerRowCanal = donnees.footerRow;
        canal.addTable(dataCanal,{
          x:0.5,
          y:0.7,
          h:0.3,
          w:9,
          color:'000000',
          fill:{
            color:'F1F1F1',
            type:'solid'
          },
          align:'center',
          fontSize:12,
          border:{
            type:'solid',
            pt:1,
            color:'000000'
          }
        });
        canal.addText('Commentaires',{
          x:1,
          y:4.2,
          align:'center',
          color:'FF7800',
          underline:{style:'heavy',color:"000000"},
        })
        canal.addText(this.donnee.dataCanal.commentaire,
        {
            shape:pptx.ShapeType.round2DiagRect,
            x:0.5,
            y:4.4,
            w:9,
            h:1,
            fontSize: 14,      
            align:'center',
            color:'#000000',
            fill: {
              color:'ffffff',
               type:'solid',
              },
              line:{
                color:'000000',
                width:1.3
              } 
            // shadow:{
            //   type: 'outer',
            //   color: "696969",
            //   blur: 3,
            //   offset: 10,
            //   angle: 60
            // },
            // fill: {
            //  color:'#FF7800',
            //  type:'solid'
            // }  
        });    
        let rang = pptx.addSlide();
        rang.addText('Détails des effectifs selon le Canal',
          {
            // shape:pptx.ShapeType.ribbon2,
            x:0.5,
            y:0.3,
            h:0.5,
            align:'center',
            color:'FF7800',
            fontSize:24
            // fill:{
            //   color:'FF7800',
            //   type:'solid'
            // },
            // shadow:{
            //   type:'outer',
            //   blur:3,
            //   offset:10,
            //   angle:45,
            //   color:'F1F1F1',
            // }
          });
          const rowsPerSlide = 14; 
          let currentRow = 0;
          let currentSlide = rang; 
          let col=0.9;
          this.donnee.dataRang.data.forEach((item: any) => {
            const category = item.key;
            const subCategories = item.value;
            let totalPermanent = 0;
            let totalPrestataire = 0;
            let totalInterimaire = 0;
            Object.values(subCategories).forEach((subCategory: any) => {
              totalPermanent += subCategory.permanent;
              totalPrestataire += subCategory.prestataire;
              totalInterimaire += subCategory.interimaire;
            });
            let totalGen = totalPermanent + totalPrestataire + totalInterimaire;
            if (currentRow >= rowsPerSlide) {
              currentSlide = pptx.addSlide();
              currentRow = 0;
            }
            currentSlide.addTable([
              [
                { text: category, options: { bold: true, color: 'FFFFFF', fill:{ color:'FF7800' }} },
                { text: totalPermanent.toString(), options: { bold: true, color: 'FFFFFF', fill:{color: 'FF7800'} } },
                { text: totalPrestataire.toString(), options: { bold: true, color: 'FFFFFF', fill: {color:'FF7800' }} },
                { text: totalInterimaire.toString(), options: { bold: true, color: 'FFFFFF', fill: {color:'FF7800'} } },
                { text: totalGen.toString(), options: { bold: true, color: 'FFFFFF', fill: {color:'FF7800' }} }
              ]
            ], {
              x: 0.5,
              y: col + currentRow *0.3, 
              w: 9,
              color: '000000',
              fill: { color: 'F1F1F1', type: 'solid' },
              align: 'center',
              fontSize: 12,
              border: { type: 'solid', pt: 1, color: '000000' }
            });
            currentRow++;
            Object.keys(subCategories).forEach((subCategoryName: string) => {
              if (currentRow >= rowsPerSlide) {
                currentSlide = pptx.addSlide();
                currentRow = 0;
              }
              const subCategory = subCategories[subCategoryName];
              let totalServ = subCategory.permanent + subCategory.prestataire + subCategory.interimaire;
              currentSlide.addTable([
                [
                  { text: `  ${subCategoryName}`, options: { color: '000000', fill: {color:'F1F1F1'} } },
                  { text: subCategory.permanent.toString(), options: { color: '000000', fill: {color:'F1F1F1'} } },
                  { text: subCategory.prestataire.toString(), options: { color: '000000', fill: {color:'F1F1F1'} } },
                  { text: subCategory.interimaire.toString(), options: { color: '000000', fill: {color:'F1F1F1'} } },
                  { text: totalServ.toString(), options: { color: 'FF7800', fill: {color:'F1F1F1'} } }
                ]
              ], {
                x: 0.5,
                y: col + currentRow * 0.3,
                w: 9,
                color: '000000',
                fill: { color: 'F1F1F1', type: 'solid' },
                align: 'center',
                fontSize: 12,
                border: { type: 'solid', pt: 1, color: '000000' }
              });
              currentRow++;
            });
          });
          if (currentRow < rowsPerSlide) {
            currentSlide.addTable([footerRowCanal], {
              x: 0.5,
              y:col + currentRow * 0.3,
              w: 9,
              color: '000000',
              fill: { color: 'F1F1F1', type: 'solid' },
              align: 'center',
              fontSize: 12,
              border: { type: 'solid', pt: 1, color: '000000' }
            });
          } 
          if(this.donnee.dataRang.commentaire!=""){  
            currentSlide.addText('Commentaires',{
              x:1,
              y:3.4,
              align:'center',
              color:'FF7800',
              underline:{style:'heavy',color:"000000"},
            })  
            currentSlide.addText(this.donnee.dataRang.commentaire,
            {
                shape:pptx.ShapeType.round2DiagRect,
                x:0.5,
                y:3.7,
                w:9,
                h:2,
                fontSize: 14,      
                align:'center',
                color:'#000000',
                fill: {
                  color:'ffffff',
                  type:'solid',
                  },
                  line:{
                    color:'000000',
                    width:1.3
                  } 
                // shadow:{
                //   type: 'outer',
                //   color: "696969",
                //   blur: 3,
                //   offset: 10,
                //   angle: 60
                // },
                // fill: {
                //   color:'#FF7800',
                //   type:'solid'
                // }  
            });
        }
          let end = pptx.addSlide();
          end.addText("MERCI!", {
            x: 0.89,
            y: 1.5,
            w: 8,
            h: 3,
            align: 'center',
            fontSize: 48, 
            fontFace: 'Verdana',
            color: 'FF7800',
            bold: true,
          });
          end.addImage({
            path:this.orange,
            x:0.3,
            y:4.6,
            h:0.7,
            w:0.8
          })
          end.addImage({
            path:this.sonatel,
            x:8.3,
            y:4.6,
          })
      pptx.writeFile({fileName:'reporting.pptx'});
      this.dialogRef.close();
  }
  table(dataCanal:any,headerCanal:any,data:any)
  {
    dataCanal.push(headerCanal);
    data.forEach((row:any)=>{
          const total = row.permanent + row.prestataire + row.interimaire;
          dataCanal.push([
          {text:row.key},
          {text:row.permanent.toString()},
          {text:row.prestataire.toString()},
          {text:row.interimaire.toString()},
          {text:total.toString(),options:{color:'FF7800'}},
          ]);
        });
        const totalPermanentCanal =  data.reduce((sum:any, row:any) => sum + row.permanent, 0);
        const totalPrestataireCanal =  data.reduce((sum:any, row:any) => sum + row.prestataire, 0);
        const totalInterimCanal =  data.reduce((sum:any, row:any) => sum + row.interimaire, 0);
        const grandTotalCanal = totalPermanentCanal + totalPrestataireCanal+totalInterimCanal;
        const footerRowCanal:any = [
          { text: 'Total', options: { bold: true,fill:'FF7800',color:'FFFFFF' } },
          { text: totalPermanentCanal.toString(), options: { bold: true,fill:'FF7800',color:'FFFFFF'}},
          { text: totalPrestataireCanal.toString(), options: { bold: true,fill:'FF7800',color:'FFFFFF'}},
          { text: totalInterimCanal.toString(), options: { bold: true,fill:'FF7800',color:'FFFFFF'}},
          { text: grandTotalCanal.toString(), options: { bold: true,fill:'FF7800',color:'FFFFFF'}}
        ];
        dataCanal.push(footerRowCanal);
        return { dataCanal:dataCanal,footerRow:footerRowCanal};
  }
  boucle(statut: any, data: any, pptx: any, ellipseWidth: number, spacing: number, labels: any, slideWidth: number,position:number) 
  {
    if (!data || !labels || data.length === 0 || labels.length === 0) {
      return;
    }
    if (data.length !== labels.length) {
      return;
    }
    let currentRow = 0;
    data.forEach((ele: any, index: number) =>
    {
      if (ele!==0) {
        const maxElementsPerRow = Math.floor((slideWidth - 1) / (ellipseWidth + spacing));
        const xPosition = 1 + ((index % maxElementsPerRow) * (ellipseWidth + spacing));
        const yPosition = ellipseWidth + (currentRow * (ellipseWidth + 0.5));
        statut.addShape(pptx.ShapeType.ellipse, {
          x: xPosition,
          y: yPosition,
          w: ellipseWidth,
          h: ellipseWidth,
          fill: {
            color: "#FF7800"
          },
          shadow: {
            type: "outer",
            color: "696969",
            blur: 3,
            offset: 10,
            angle: 60
          },
        });
        statut.addText(`${ele}`, {
          x: xPosition,
          y: yPosition,
          w: ellipseWidth,
          h: ellipseWidth,
          fontSize: 14,
          align: 'center',
          color: '#FFFFFF',
        });
        statut.addShape(pptx.ShapeType.line,{
           x: xPosition,
            y:yPosition + ellipseWidth + 0.2,
            w:ellipseWidth,
            h:0,
            line:{
              color:'#000000',
              width:0.5
            },
            lineSize:1,
        });
        statut.addText(labels[index], {
          x: xPosition,
          y: yPosition + ellipseWidth + 0.4,
          w: ellipseWidth,
          fontSize: 12,
          align: 'center',
          color: '#000000',
        });
        if((index + 1) % maxElementsPerRow === 0){
          currentRow += 1;
        }
      }
    });
  }
}
  