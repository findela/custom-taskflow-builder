import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { TaskflowBuilderService } from "../../../shared/services/taskflow-builder.service";

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.css']
})
export class BlockComponent implements OnInit, OnChanges {

  nodeCatalogue: any = {data: [], selected: ''};
  currentTab: any = 'catalogues';
  isLoading: boolean = false;
  isDisabled: boolean = false;

  constructor(private taskflow: TaskflowBuilderService) { }

  @Input() selectedNodeDetails: any = {};
  @Input() actionCommands: any = {};
  @Output() nodeSelected = new EventEmitter<object>();

  ngOnInit(): void {
    // this.fetchNodeCatalogue();
  }

  ngOnChanges(): void {
    this.isDisabled = (this.actionCommands.mode === 'viewer');
    if(this.selectedNodeDetails.toggleProperty) {
      this.nodeCatalogue.selected = "";
    }
    if(this.selectedNodeDetails.syncList && this.selectedNodeDetails.data) {
      if (this.nodeCatalogue.data.length && Object.keys(this.selectedNodeDetails.data).length) {
        if (this.nodeCatalogue.data.filter((k) => k.nodeId === this.selectedNodeDetails.data.nodeId).length) {
          this.nodeCatalogue.data.forEach((key, index) => {
            if (key.nodeId === this.selectedNodeDetails.data.nodeId) {
              this.nodeCatalogue.data[index] = this.selectedNodeDetails.data;
            }
          })
        } else {
          this.nodeCatalogue.data.push(this.selectedNodeDetails.data);
        }
      } else {
        this.nodeCatalogue.data.push(this.selectedNodeDetails.data);
      }
      this.selectedNodeDetails.syncList = false;
    }
  }

  fetchNodeCatalogue = () => {
    this.isLoading = true;
    this.taskflow.fetchNodeCatalogue().then((response) => {
      this.nodeCatalogue.data = response.result;
      this.isLoading = false;
    });
  };

  selectNode = (node) => {
    if(node.nodeId === this.nodeCatalogue.selected.nodeId) {
      this.nodeCatalogue.selected = '';
    }
    else {
      this.nodeCatalogue.selected = node;
    }
  };

  triggerNode = () => {
    this.nodeSelected.emit({selected: this.nodeCatalogue.selected, templates: this.nodeCatalogue.data});
    this.nodeCatalogue.selected = '';
  };

  setCurrentTab = (tab) => {
    if(this.currentTab === 'activities' && this.currentTab !== tab) {
      // this.fetchNodeCatalogue();
    }
    this.currentTab = tab;
  }

}
