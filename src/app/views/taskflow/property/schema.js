export const basicDetails = {
  label: '',
  id: '',
  nodeId: '',
  nodeType: '',
  description: '',
  placeURI: '',
  judgementCount: '',
  minuteDuration: '',
  background: ''
};

export const attributeList = [
  {
    type: "Lightning",
    attributes: ['X FACTOR', 'Y Factor', 'Z Factor']
  },
  {
    type: "NLP",
    attributes: ['A FACTOR', 'B Factor', 'C Factor']
  },
  {
    type: "Semantic Segmentation",
    attributes: ['A FACTOR', 'X Factor', 'Z Factor']
  },
  {
    type: "Point Cloud",
    attributes: ['C FACTOR', 'Y Factor', 'B Factor']
  }
];

export const converterMapTree = [
  {
    source: "Lightning",
    target: "Semantic Segmentation",
    converter: {
      name: "LS Type Converter",
      id: 1,
      config: {}
    }
  },
  {
    source: "Semantic Segmentation",
    target: "Lightning",
    converter: {
      name: "SL Type Converter",
      id: 2,
      config: {}
    }
  },
  {
    source: "Point Cloud",
    target: "Semantic Segmentation",
    converter: {
      name: "PS Type Converter",
      id: 3,
      config: {}
    }
  },
  {
    source: "Lightning",
    target: "Point Cloud",
    converter: {
      name: "LP Type Converter",
      id: 4,
      config: {}
    }
  },
  {
    source: "NLP",
    target: "Point Cloud",
    converter: {
      name: "NP Type Converter",
      id: 5,
      config: {}
    }
  },
  {
    source: "Semantic Segmentation",
    target: "Point Cloud",
    converter: {
      name: "SP Type Converter",
      id: 6,
      config: {}
    }
  },
  {
    source: "Semantic Segmentation",
    target: "NLP",
    converter: {
      name: "SN Type Converter",
      id: 7,
      config: {}
    }
  },
  {
    source: "Lightning",
    target: "NLP",
    converter: {
      name: "LN Type Converter",
      id: 8,
      config: {}
    }
  }
];
