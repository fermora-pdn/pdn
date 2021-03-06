import * as d3 from 'd3'

/*
   * This data manipulation function takes the raw data from
   * the CSV file and converts it into an array of node objects.
   * Each node will store data and visualization values to visualize
   * a bubble.
   *
   * rawData is expected to be an array of data objects, read in from
   * one of d3's loading functions like d3.csv.
   *
   * This function returns the new node array, with a node in that
   * array for each element in the rawData input.
   */
export function createNodes(rawData, type) {
    // Use the max total_amount in the data as the max in the scale's domain
    // note we have to ensure the total_amount is a number.
    const maxAmount = type===1 || type===2 ? d3.max(rawData, d => d.total_sanciones):  type==='sanciones'?d3.max(rawData, d=> d.sanciones_total): d3.max(rawData, d=> d.monto_total);
    const minAmount = type===1 || type===2 ? d3.min(rawData, d => d.total_sanciones):  type==='sanciones'?d3.min(rawData, d=> d.sanciones_total): d3.min(rawData, d=> d.monto_total);

    let pivote = (maxAmount-minAmount)/10;

    let max =  type===1 ?85: type===2 ? 130: type==='sanciones'? 120 : 260;
    // Sizes bubbles based on area.
    // @v4: new flattened scale names.
    const radiusScale = d3.scalePow()
        .exponent(0.5)
        .range([2, max])
        .domain([0, maxAmount]);

    // Use map() to convert raw data into node data.
    // Checkout http://learnjsdata.com/ for more on
    // working with data.
    let id=0;
    const myNodes= rawData.map(d => (
        {
            id: (id+1).toString(),
            radius: radiusScale(+d.total_sanciones),
            dependencia: d.dependencia,
            group: d.total_sanciones<=pivote?'n1':d.total_sanciones<=pivote*2?'n2':d.total_sanciones<=pivote*3?'n3':d.total_sanciones<=pivote*4?'n4':d.total_sanciones<=pivote*5?'n5':d.total_sanciones<=pivote*6?'n6':d.total_sanciones<=pivote*7?'n7':d.total_sanciones<=pivote*8?'n8':d.total_sanciones<=pivote*9?'n9':'n10',
            sancionesTotal : d.total_sanciones,
            x: Math.random() * 900,
            y: Math.random() * 800,
        }));

    id = 1;
    const myNodesSanciones = rawData.map(d => (
        {
            id: '2',
            radius: radiusScale(d.sanciones_total),
            dependencia: d.dependencia,
            group: d.sanciones_total <= pivote ? 'n1' : d.sanciones_total <= pivote * 2 ? 'n2' : d.sanciones_total <= pivote * 3 ? 'n3' : d.sanciones_total <= pivote * 4 ? 'n4' : d.sanciones_total <= pivote * 5 ? 'n5' : d.sanciones_total <= pivote * 6 ? 'n6' : d.sanciones_total <= pivote * 7 ? 'n7' : d.sanciones_total <= pivote * 8 ? 'n8' : d.sanciones_total <= pivote * 9 ? 'n9' : 'n10',
            sancionesTotal: d.sanciones_total,
            montoTotal: d.monto_total,
            x: Math.random() * 900,
            y: Math.random() * 800,
        }));
    let id2 = 2;
    const myNodesMontos = rawData.map(d => (
        {
            id: (id2 + 1).toString(),
            radius: radiusScale(+d.monto_total),
            dependencia: d.dependencia,
            group: d.monto_total <= pivote ? 'n1' : (d.monto_total <= pivote * 2 ? 'n2' : d.monto_total <= pivote * 3 ? 'n3' : d.monto_total <= pivote * 4 ? 'n4': d.monto_total <= pivote * 5 ? 'n5' : d.monto_total <= pivote * 6 ?'n6' : d.monto_total <= pivote * 7? 'n7' : d.monto_total <= pivote*8 ? 'n8' : d.monto_total <= pivote*9? 'n9':'n10'),
            sancionesTotal: d.sanciones_total,
            montoTotal: d.monto_total,
            x: Math.random() * 900,
            y: Math.random() * 800,
        }));
    // sort them descending to prevent occlusion of smaller nodes.
    type===1 || type===2 ? myNodes.sort((a, b) => b.sancionesTotal - a.sancionesTotal):type==='sanciones' ? myNodesSanciones.sort((a,b)=>b.sancionesTotal - a.sancionesTotal):  myNodesMontos.sort((a, b) => b.montoTotal - a.montoTotal);
    return type ===1 || type===2 ? myNodes: type==='sanciones'? myNodesSanciones : myNodesMontos;
}

export function createNodesGroup(data){
    const maxAmount = d3.max(data, d => +  d.sanciones_total);
    const minAmount = d3.min(data,d=> d.sanciones_total);

    let pivote = (maxAmount-minAmount)/3;

    // Sizes bubbles based on area.
    // @v4: new flattened scale names.
    const radiusScale = d3.scalePow()
        .exponent(0.5)
        .range([2, 85])
        .domain([0, maxAmount]);

    let id2=0;
    const myNodes = data.map(d => (
        {
            id: (id2+1).toString(),
            radius: radiusScale(+d.sanciones_total),
            causa: d.causa.trim(),
            group: d.sanciones_total<=pivote?'low':(d.sanciones_total<=pivote*2?'medium':'high'),
            sancionesTotal : d.sanciones_total,
            x: Math.random() * 900,
            y: Math.random() * 800,
        }));
    myNodes.sort((a, b) => b.sancionesTotal - a.sancionesTotal);
    return myNodes;
}

//export const fillColor = d3.scaleOrdinal().domain(['n1', 'n2','n3', 'n4','n5','n6','n7','n8','n9','n10']).range(['#e8f5e9', '#c8e6c9', '#a5d6a7','#81c784','#66bb6a','#4caf50','#43a047','#388e3c','#2e7d32','#1b5e20'],);
export const fillColor = d3.scaleOrdinal().domain(['n1', 'n2','n3', 'n4','n5','n6','n7','n8','n9','n10']).range(['#e0f2f1', '#b2dfdb', '#80cbc4','#4db6ac','#66bb6a','#4caf50','#43a047','#388e3c','#2e7d32','#1b5e20'],);