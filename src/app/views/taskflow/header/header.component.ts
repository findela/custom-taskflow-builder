import { Component, OnInit, Output, Input, EventEmitter, OnChanges, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,OnChanges {

  actionCommands: any = {action: '', mode: 'builder'};

  @Output() emitAction : EventEmitter<any> = new EventEmitter<any>();
  @Input() nodeData: any = [];
  viewerDisabled: boolean = true;

  constructor(@Inject(DOCUMENT) private document: any) {}
  elem;

  ngOnInit(): void {
    this.elem = document
  }

  ngOnChanges(): void {
    if(this.nodeData.length) {
      this.viewerDisabled = false;
    }
  }

  toggleMode = (mode) => {
    this.actionCommands.mode = mode;
    this.elem.body.classList.remove("overflow-auto");
    this.elem.body.classList.remove("overflow-hidden");
    if (this.actionCommands.mode === 'viewer') {
      this.elem.body.classList.add("overflow-auto");
    }
    else {
      this.elem.body.classList.add("overflow-hidden");
    }
    this.emitAction.emit(this.actionCommands);
  }

  playBuilder = () => {
    const elem = this.elem.getElementById("editor-panel");
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      /* Firefox */
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      /* IE/Edge */
      elem.msRequestFullscreen();
    }
    this.actionCommands.action = "play";
    this.emitAction.emit(this.actionCommands);
  }
}
