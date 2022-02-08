import { Component, OnInit, Input, OnChanges, Output, EventEmitter, OnDestroy } from '@angular/core';
import { basicDetails, attributeList, converterMapTree } from './schema';
import { TaskflowBuilderService } from "../../../shared/services/taskflow-builder.service";

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.css']
})
export class PropertyComponent implements OnInit, OnChanges, OnDestroy {

  currentTab: any = 'basic';
  isLoading: boolean = false;
  toggleAddInstance: boolean = false;
  relationCollapse: any = {from: false, to: true};
  nodeDetails: any = {};

  @Input() selectedNodeDetails: any = {};
  @Input() nodeTemplateList: any = [];
  @Output() isToggle : EventEmitter<any> = new EventEmitter<any>();

  constructor(private taskflow: TaskflowBuilderService) { }

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.resetNodeDetails();
    if(Object.keys(this.selectedNodeDetails.data).length) {
      this.nodeDetails.basic = {
        ...this.nodeDetails.basic,
        ...this.selectedNodeDetails.data
      };
      delete this.nodeDetails.basic['connection'];
      this.nodeDetails.configuration.instance.meta.source = this.nodeDetails.basic;
      if(this.nodeDetails.configuration.flowChartData.nodes.length > 1) {
        this.prepareTargetNodeList();
      }
    }
  };


  prepareTargetNodeList = () => {
    this.nodeDetails.configuration.flowChartData.nodes.forEach((key) => {
      if(key.id !== this.nodeDetails.basic.id) {
        // delete key['dimension']; delete key['meta']; delete key['position']; delete key['data'];
        // let obj = JSON.parse(JSON.stringify(key));
        this.nodeDetails.configuration.listNodes.push(key);
      }
    });
    if(this.nodeDetails.configuration.flowChartData.links.length) {
      this.prepareConnection();
    }
  }

  resetNodeDetails = () => {
    this.nodeDetails = {
      basic: {...basicDetails},
      connection: {
        from: [],
        to: []
      },
      configuration: {
        attributeList: [],
        listNodes: [],
        instance: {
          meta: { source: "", target: "", label: "" }, edit: false, attributes:[], condition:[]
        },
        converterLinks: [],
        flowChartData: this.selectedNodeDetails.flowChartData
      }
    };
  };

  filterConverterLinks = () => {
    this.nodeDetails.configuration = {
      ...this.nodeDetails.configuration,
      attributeList: [],
      converterLinks: []
    };
    const filterAttributes =
      attributeList.filter((key) => key.type === this.nodeDetails.configuration.instance.meta.target.nodeType);
    if(filterAttributes.length && filterAttributes[0].attributes.length) {
      filterAttributes[0].attributes.forEach((key) => {
        this.nodeDetails.configuration.attributeList.push({value: key, selected: false});
      })
    }
    const filterConverters = converterMapTree.filter((key) => (this.nodeDetails.basic.nodeType === key.source &&
      this.nodeDetails.configuration.instance.meta.target.nodeType === key.target));
    if(filterConverters.length) {
      filterConverters.forEach((key) => {
        this.nodeDetails.configuration.converterLinks.push(key);
      })
    }
  };

  setAttribute = (obj) => {
    if(this.nodeDetails.configuration.instance.attributes.length &&
      this.nodeDetails.configuration.instance.attributes.indexOf(obj.value) > -1) {
      this.nodeDetails.configuration.instance.attributes.splice(
        this.nodeDetails.configuration.instance.attributes.indexOf(obj.value),
        1
      );
    }
    else {
      this.nodeDetails.configuration.instance.attributes.push(obj.value);
    }
  };

  setCurrentTab = (tab) => {
    this.currentTab = tab;
    this.toggleAddInstance = false;
    this.resetInstance();
    this.nodeDetails.configuration.instance.meta.source = this.nodeDetails.basic;
  };

  ngOnDestroy(): void {
    this.selectedNodeDetails.toggleProperty = false;
  };

  saveNodeDetails = () => {
    if(this.selectedNodeDetails.data.nodeType !== undefined &&
      (this.nodeDetails.connection.from.length || this.nodeDetails.connection.to.length) &&
      this.selectedNodeDetails.data.nodeType !== this.nodeDetails.basic.nodeType){
      this.taskflow.handleError("Not allowed to change when one or more connections exist");
      this.nodeDetails.basic.nodeType = this.selectedNodeDetails.data.nodeType;
    } else {

      if (!this.nodeDetails.basic.id) {
        this.nodeDetails.basic.id = Math.random().toString(36).slice(2);
        this.nodeDetails.basic.nodeId = 'C8';
        this.nodeDetails.basic.background = this.taskflow.getRandomColor();

        this.nodeDetails.configuration.flowChartData.nodes.push(this.nodeDetails.basic);
      } else {
        this.nodeDetails.configuration.flowChartData.nodes.forEach((key, index) => {
          if (key.id === this.nodeDetails.basic.id) {
            this.nodeDetails.configuration.flowChartData.nodes[index] = {
              ...this.nodeDetails.configuration.flowChartData.nodes[index],
              ...this.nodeDetails.basic
            };
          }
        })
      }

      this.buildConverterTree();

      // this.nodeDetails.configuration.flowChartData.nodes = Object.assign([], this.nodeDetails.configuration.flowChartData.nodes);
      this.emitDataToParent(true, false);
    }
  };

  createInstance = () => {
    if(!this.nodeDetails.configuration.instance.edit) {
      this.nodeDetails.configuration.flowChartData.links.push({
        ...this.nodeDetails.configuration.instance,
        source: this.nodeDetails.configuration.instance.meta.source.id,
        target: this.nodeDetails.configuration.instance.meta.target.id,
        label: (typeof this.nodeDetails.configuration.instance.meta.label === 'object') ?
          this.nodeDetails.configuration.instance.meta.label.converter.name :
          this.nodeDetails.configuration.instance.meta.label,
      });
    }

    else {
      this.nodeDetails.configuration.flowChartData.links.forEach((key, index) => {
        if(key.id === this.nodeDetails.configuration.instance.id) {
          this.nodeDetails.configuration.flowChartData.links[index] =
            {
              ...this.nodeDetails.configuration.flowChartData.links[index],
              ...this.nodeDetails.configuration.instance,
              source: this.nodeDetails.configuration.instance.meta.source.id,
              target: this.nodeDetails.configuration.instance.meta.target.id,
              label: (typeof this.nodeDetails.configuration.instance.meta.label === 'object') ?
                this.nodeDetails.configuration.instance.meta.label.converter.name :
                this.nodeDetails.configuration.instance.meta.label,
            }
        }
      });
      // this.nodeDetails.configuration.flowChartData.links = Object.assign([], this.nodeDetails.configuration.flowChartData.links);
    }

    this.prepareConnection();

    this.buildConverterTree();

    this.toggleAddInstance = false;
    this.emitDataToParent(false, true);
    this.nodeDetails.configuration = {
      ...this.nodeDetails.configuration,
      attributeList: [],
      converterLinks: [],
      instance: {
        meta: { ...this.nodeDetails.configuration.instance.meta, target: "", label: "" }, attributes:[], condition:[]
      }
    }
  };

  buildConverterTree = () => {
    if (this.nodeDetails.configuration.flowChartData.links.length) {
      this.nodeDetails.configuration.flowChartData.converters = [];
      this.nodeDetails.configuration.flowChartData.links.forEach((key,index) => {
        this.nodeDetails.configuration.flowChartData.converters.push(JSON.parse(JSON.stringify(key.meta.label)));
      });
    }
  }

  prepareConnection = () => {
    this.nodeDetails.connection= {from: [], to: []};
    this.nodeDetails.configuration.flowChartData.links.forEach((key, index) => {
      if(key.source === this.nodeDetails.basic.id) {
        this.nodeDetails.connection.to.push(key);
      }
      else if(key.target === this.nodeDetails.basic.id) {
        this.nodeDetails.connection.from.push(key);
      }
    });
  }

  emitDataToParent = (flag, toggle) => {
    this.isToggle.emit({
      flowChartData: this.nodeDetails.configuration.flowChartData,
      syncList: flag,
      toggleProperty: toggle
    });
    if(!toggle) {
      this.resetNodeDetails();
    }
    // this.nodeDetails.basic = basicDetails;
  };

  editInstance = (connection) => {
    const instance = JSON.parse(JSON.stringify(connection));
    this.toggleAddInstance = true;
    this.nodeDetails.configuration.instance = {
      ...this.nodeDetails.configuration.instance,
      ...instance,
      meta: instance.meta,
      edit: true
    };
    this.nodeDetails.configuration.listNodes.forEach((key, index) => {
      if(key.id === this.nodeDetails.configuration.instance.meta.target.id) {
        this.nodeDetails.configuration.listNodes[index] = this.nodeDetails.configuration.instance.meta.target;
      }
    });
    this.filterConverterLinks();
    this.nodeDetails.configuration.converterLinks.forEach((key, index) => {
      if(key.converter.id === this.nodeDetails.configuration.instance.meta.label.converter.id) {
        this.nodeDetails.configuration.converterLinks[index] = this.nodeDetails.configuration.instance.meta.label;
      }
    });
    if(connection.attributes.length && this.nodeDetails.configuration.attributeList.length) {
      connection.attributes.forEach((k) => {
        this.nodeDetails.configuration.attributeList.forEach((key) => {
          if(!key.selected) {
            key.selected = (key.value === k);
          }
        })
      });
    }
  };

  resetInstance = () => {
    this.nodeDetails.configuration = {
      ...this.nodeDetails.configuration,
      instance: { meta: {...this.nodeDetails.configuration.instance.meta, target: "", label: ""}, attributes:[], condition:[] },
      attributeList: [],
      converterLinks: []
    };
  }

  deleteInstance = (index, type) => {
    this.nodeDetails.configuration.flowChartData.links.forEach((key, i) => {
      if(key.id === this.nodeDetails.connection[type][index].id) {
        this.nodeDetails.configuration.flowChartData.links.splice(i, 1);
        this.nodeDetails.connection[type].splice(index, 1);
      }
    });
    this.emitDataToParent(true, true);
    // this.nodeDetails.connection[type].splice(index, 1);
  }
}
