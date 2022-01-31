import {AfterViewInit, Component, OnInit} from '@angular/core';
import * as shape from 'd3-shape';
import { TaskflowBuilderService } from "../../../shared/services/taskflow-builder.service";
import { Subject } from 'rxjs';

@Component({
  selector: 'app-builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.css']
})
export class BuilderComponent implements AfterViewInit,OnInit {

  hierarchialGraph = { nodes: [], links: [] };
  actionCommands: any = {action: '', mode: 'builder'};
  curve = shape.curveNatural;
  selectedNodeDetails: any = {};
  isLoading: any = false;
  nodeTemplateList: any = [];

  // center$: Subject<boolean> = new Subject();
  update$: Subject<boolean> = new Subject();
  zoomToFit$: Subject<boolean> = new Subject();

  constructor(private taskflow: TaskflowBuilderService) {}

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.dummyTaskflowData();
  }

  updateGraph() {
    this.update$.next(true);
    this.zoomToFitGraph();
  }

  zoomToFitGraph() {
    this.zoomToFit$.next(true)
  }

  dummyTaskflowData = () => {
    this.isLoading = true;
    this.taskflow.dummyTaskflowData().then((response) => {
      this.hierarchialGraph = response.result;
      this.updateGraph();
      this.isLoading = false;
    });
  };

  getDetails = (data, event) => {
    for (const el of Object.values(document.getElementById("chart-container").getElementsByClassName('node'))) {
      if (el.classList.contains('active')) {
        el.classList.remove("active");
      }
    }
    event.currentTarget.classList.add("active");
    this.selectedNodeDetails = {
      data,
      toggleProperty: true,
      flowChartData: this.hierarchialGraph
    };
    setTimeout(() => {
      this.updateGraph();
    }, 300);
  };

  isToggle = (obj) => {
    this.selectedNodeDetails.toggleProperty = obj.toggleProperty;
    this.selectedNodeDetails.syncList = obj.syncList;
    this.hierarchialGraph.nodes = Object.assign([], obj.flowChartData.nodes);
    this.hierarchialGraph.links = Object.assign([], obj.flowChartData.links);
    this.updateGraph();
    setTimeout(() => {
      if(!this.selectedNodeDetails.toggleProperty) {
        for (const el of Object.values(document.getElementById("chart-container").getElementsByClassName('node'))) {
          if (el.classList.contains('active')) {
            el.classList.remove("active");
          }
        }
      }
    }, 100);
  };

  nodeSelected = (obj) => {
    this.selectedNodeDetails = {
      data: {},
      toggleProperty: true,
      flowChartData: this.hierarchialGraph
    };
    if (Object.keys(obj.selected).length) {
      this.selectedNodeDetails.data = {
        ...obj.selected,
        // position: {x: 65, y: 115},
        // transform: "translate(30, 100)"
      };
    }
    if(obj.templates.length) {
      this.nodeTemplateList = obj.templates;
    }
  };

  emitAction = (data) => {
    this.actionCommands = {...data};
    this.selectedNodeDetails.toggleProperty = false;
    if(this.actionCommands.mode === 'builder') {
      this.updateGraph();
    }
  }

  getJSONData = () => {
    const sJson = JSON.stringify(this.hierarchialGraph);
    const date = new Date();
    const dateStr =
      ("00" + (date.getMonth() + 1)).slice(-2) + "-" +
      ("00" + date.getDate()).slice(-2) + "-" +
      date.getFullYear() + "-" +
      ("00" + date.getHours()).slice(-2) + "-" +
      ("00" + date.getMinutes()).slice(-2) + "-" +
      ("00" + date.getSeconds()).slice(-2);
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      "data:text/json;charset=UTF-8," + encodeURIComponent(sJson)
    );
    element.setAttribute('download', dateStr+".json");
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click(); // simulate click
    document.body.removeChild(element);
  }
}
