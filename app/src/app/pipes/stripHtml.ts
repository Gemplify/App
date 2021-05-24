import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'stripHtml'})
export class StripHtml implements PipeTransform{
  transform(value: string): any{
    return value.replace(/<.*?>/g, '');
  }
}
