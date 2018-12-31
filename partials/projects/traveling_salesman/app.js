"use strict";
//min swaps and max swaps per genome
//time per epoch
// use window.performance.now(); to get time

//(function() {
	const totalCities = 16,
		popSize = 16384,
		maxX = 315,
		maxY = 340,
		sqrSize = 10,
		hSqrSize = 5;
		
	
	var dispWidth,
		dispHeight,
		cities = new Array(totalCities),
		population = new Array(popSize),
		fitness = new Array(popSize),
		bestDist = Infinity,
		bestPath,
		genBestDist,
		genBestPath,
		context,
		oldTime = window.performance.now(),
		newTime;
	
    function main() {
		var order = [];
		
        var canvas = document.getElementById("appSurface");
		dispWidth = canvas.width;
		dispHeight = canvas.height;
        context = canvas.getContext("2d");
		context.strokeStyle = "#000000";
		context.lineWidth = 2;
		
		for(var i = 0; i < totalCities; ++i) {
			cities[i] = [randInt(15, maxX), randInt(30, maxY)];
			order.push(i);
		}
		
		for(var i = 0; i < popSize; ++i) {
			population[i] = shuffle(order);
		}
		
        window.requestAnimationFrame(drawFrame);
	}
	
    function drawFrame() {
        calcFitness();
		normalizeFitness();
		nextGen();
		
		context.fillStyle = "#FFFFFF";
        context.fillRect(0, 0, dispWidth, dispHeight);
		context.fillStyle = "#000000";
		
		for (var i = 0; i < totalCities; ++i) {
			var city = cities[i];
			context.fillRect(city[0]-hSqrSize, city[1]-hSqrSize, sqrSize, sqrSize);
			context.fillRect(city[0]+maxX-hSqrSize, city[1]-hSqrSize, sqrSize, sqrSize);
		}
		
		for (var i = 0; i < totalCities - 1; ++i){
			var cityA = cities[bestPath[i]],
				cityB = cities[bestPath[i+1]];
				
			context.beginPath();
			context.moveTo(cityA[0], cityA[1]);
			context.lineTo(cityB[0], cityB[1]);
			context.stroke();
		}
		
		for (var i = 0; i < totalCities - 1; ++i){
			var cityA = cities[genBestPath[i]],
				cityB = cities[genBestPath[i+1]];
				
			context.beginPath();
			context.moveTo(cityA[0]+maxX, cityA[1]);
			context.lineTo(cityB[0]+maxX, cityB[1]);
			context.stroke();
		}
		
		newTime = window.performance.now();
		context.fillText("Time for last generation: " + Math.floor(newTime - oldTime) + "ms",15,15);
		oldTime = newTime;
		
        window.requestAnimationFrame(drawFrame);
    }
	
	function nextGen() {
		var newPopulation = new Array(popSize);
		for (var i = 0; i < popSize; ++i){
			var order = pickOne(population, fitness);
			mutate(order, 0.1);
			newPopulation[i] = order;
		}
		population = newPopulation;
	}
	
	function calcFitness() {
		genBestDist = Infinity;
		for(var i = 0; i < popSize; ++i){
			var dist = calcDistSqr(cities, population[i]);
			if (dist < genBestDist) {
				genBestDist = dist;
				genBestPath = population[i];
				if( dist < bestDist ) {
					bestDist = dist;
					bestPath = population[i];
					console.log("new best");
				}
			}
			fitness[i] = 1.0 / (dist + 1.0);
		}
	}
	
	function normalizeFitness() {
		var sum = 0;
		for (var i = 0; i < popSize; ++i)
			sum += fitness[i];
		for (var i = 0; i < popSize; ++i)
			fitness[i] /= sum;
	}
	
	function mutate(order, alpha) {
		for (var i = 0; i < totalCities; ++i) {
			if(Math.random() < alpha) {
				var indexA = randInt(0, totalCities),
					indexB = randInt(0, totalCities);
				if(indexB == indexA)
					indexB = (indexB + 1) % totalCities;
				var temp = order[indexB];
				order[indexB] = order[indexA];
				order[indexA] = temp;
			}
		}
	}
	
	function pickOne(list, prob) {
		var index = 0,
			r = Math.random();

		while (r > 0) {
			r -= prob[index];
			++index;
		}
		--index;
		return list[index].slice();
	}
	
	// Utility functions below
	function randInt(min, max){
		return Math.floor(Math.random() * (max - min) + min);
	}
	
	function shuffle(arr) {
		var copy = arr.slice(),
			newArr = [];
		
		while (copy.length) {
			var item = copy.splice(randInt(0, copy.length), 1);
			newArr.push(item[0]);
		}
		
		return newArr;
	}
	
	function calcDistSqr(points, sequence) {
		var sum = 0;
		for(var i = 0; i < sequence.length - 1; ++i) {
			var pointA = points[sequence[i]],
				pointB = points[sequence[i+1]];
			
			sum += Math.pow(pointB[0]-pointA[0], 2) + Math.pow(pointB[1]-pointA[1], 2);
		}
		return sum;
	}
	
	main();
//})(); //encapsulation