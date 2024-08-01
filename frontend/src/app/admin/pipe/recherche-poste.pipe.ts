import { Pipe, PipeTransform } from '@angular/core';
import { Interim } from 'src/app/_core/interface/interim';

@Pipe({
  name: 'recherchePoste',
  standalone: true
})
export class RecherchePostePipe implements PipeTransform {

  transform(value: Interim[], search:string): any {
    let data : any[]=[]
    if(!value){
      return null
    }
    if(!search){
      return value
    }
    return value.filter((item)=>{
      return item.poste.libelle.toLowerCase()=== search.toLowerCase();
    })
    
  }

}
