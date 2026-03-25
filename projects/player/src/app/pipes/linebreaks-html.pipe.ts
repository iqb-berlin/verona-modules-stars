import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lineBreaksHtml'
})
export class LinebreaksHtmlPipe implements PipeTransform {
  transform(text: string): string {
    return text.replace(/\r?\n/g, '<br>');
  }
}
