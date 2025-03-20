import { Component, input, OnInit } from '@angular/core';
import { FormGroup } from "@angular/forms";

import { Section } from "../../models/section";
import { VeronaPostService } from "../../services/verona-post.service";


@Component({
  selector: 'stars-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss'],
  standalone: false
})

export class SectionComponent implements OnInit {
  section = input.required<Section>();
  form = new FormGroup({});
  sectionCounter: number | undefined;
  VeronasService = new VeronaPostService();

  constructor() {

  }

  ngOnInit(): void {

  }
}
