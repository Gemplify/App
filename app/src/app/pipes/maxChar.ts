import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'maxChar'})
export class MaxChar implements PipeTransform{
  transform(str: string, max: number): any{
    return (str.length > max) ? str.substring(0, max) + '...' : str;
  }
}
