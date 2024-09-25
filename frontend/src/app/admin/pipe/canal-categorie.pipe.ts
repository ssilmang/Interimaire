import { Pipe, PipeTransform } from '@angular/core';
import { Role } from 'src/app/_core/interface/interim';
import { Permanent } from 'src/app/_core/interface/permanent';

@Pipe({
  name: 'canalCategorie',
  standalone: true
})
export class CanalCategoriePipe implements PipeTransform {

  transform(value: any[],canal:Role,categorie:Role,libelle:string): any[] {
    console.log(canal);
    console.log(categorie);
    let data:any[]=[];
    if(!canal && !categorie ){
      return value;
    }
    if(!value){
      return [];
    }
    if(libelle ==="interimaire" ){
      if(canal || categorie){
        data = value.filter(ele=>{
          const canalMatch = canal?ele.responsable.canal.id === canal.id : true;
          const categorieMath = categorie? ele.categorie.agence.id === categorie.id : true;
          return categorieMath && canalMatch;
        })
      }
    }else{
      if(canal || categorie){
        data = value.filter(ele=>{
          const canalMatch = canal?ele.canal.id === canal.id : true;
          const categorieMath = categorie? ele.categorie.id === categorie.id : true;
          return categorieMath && canalMatch;
        })
      }
    }
   
   console.log(libelle);
   console.log(data);
    return data;
    
  }

}
