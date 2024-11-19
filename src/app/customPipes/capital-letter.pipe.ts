import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalLetter',
  standalone: true
})
export class CapitalLetterPipe implements PipeTransform {

  transform(value:string):string {
    return `${value.charAt(0).toUpperCase()}${value.substring(1,value.length)}`;
  }

}
