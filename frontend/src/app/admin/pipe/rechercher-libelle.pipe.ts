import { Pipe, PipeTransform } from '@angular/core';
import { Interim } from 'src/app/_core/interface/interim';

@Pipe({
  name: 'rechercherLibelle',
  standalone: true
})
export class RechercherLibellePipe implements PipeTransform {

  transform(value: any,libelle:string): any[] {
    let data :any[]=[]
    if(!value){
      return []
    }
    if(!libelle){
      return value;
    }
    if(libelle.length){
    data = value.filter((elem:any)=>{
        return elem.profile.matricule.toLowerCase().includes(libelle.toLowerCase()) || 
        elem.profile.prenom.toLowerCase().includes(libelle.toLowerCase()) ||
        elem.profile.nom.toLowerCase().includes(libelle.toLowerCase());
      })
    }
    return data;
  }

}
