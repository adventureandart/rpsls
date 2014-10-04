'use strict';

var rpslsAppGame = angular.module('rpslsApp.game', [])

   /**
    * Game Manager
    */

   .service( 'gameManager', ['$filter', function($filter) {

      // Create the players
      var players = [
         { id: 'human', name: 'You', chosen: null },
         { id: 'robot', name: 'Robot', chosen: null }
      ];

      // Declare the moves
      var moves = {
         'rock' : { id: 'rock', name: 'Rock', chosen: false, defeats: [
            { verb: 'crushes', id: 'lizzard' },
            { verb: 'crushes', id: 'scissors' }
         ]},
         'paper' : { id: 'paper', name: 'Paper', chosen: false, defeats: [
            { verb: 'covers', id: 'rock' },
            { verb: 'disproves', id: 'spock' }
         ]},
         'scissors' : { id: 'scissors', name: 'Scissors', chosen: false, defeats: [
            { verb: 'cut', id: 'paper' },
            { verb: 'decapitate', id: 'lizzard' }
         ]},
         'lizzard' : { id: 'lizzard', name: 'Lizzard', chosen: false, defeats: [
            { verb: 'poisons', id: 'spock' },
            { verb: 'eats', id: 'paper' }
         ]},
         'spock' : { id: 'spock', name: 'Spock', chosen: false, defeats: [
            { verb: 'smashes', id: 'scissors' },
            { verb: 'vaporizes', id: 'rock' }
         ]}
      };

      // Set the initial scores
      var scores = {
         humanWins: 0,
         ties: 0,
         robotWins: 0
      };

      // Get the array of player data
      this.getPlayerData = function() {
         return players;
      }

      // Get the array of moves data
      this.getMoveData = function() {
         return moves;
      }

      // Get the array of moves data
      this.getScoreData = function() {
         return scores;
      }

      // Get the human player's selected move
      this.humanChoice = null;

      this.getHumanMove = function() {
         this.moveData = this.getMoveData();
         this.humanChoiceObject = this.moveData[this.humanChoice];

         return this.humanChoiceObject;
      }

      // Pick a random move for the robot player
      this.getRobotMove = function() {
         this.possibleMoves = this.getMoveData();
         this.tempMovesList = Object.keys(this.possibleMoves);
         this.getRandomMove = this.tempMovesList[Math.floor(Math.random() * this.tempMovesList.length)];
         this.robotMoveObject = this.possibleMoves[this.getRandomMove];

         return this.robotMoveObject;
      }

      // Figure out who won the round and update score
      this.getWinner = function( humanMove, robotMove ) {
         this.moveData = this.getMoveData();
         this.roundWinner = null;
         this.infoText = "Select your first move below:";

         if ( humanMove.id == robotMove.id ) {
            this.roundWinner = 'tie';
            this.infoText = 'That\'s a draw!';
         } else {
            var humanWin = $filter('arrayContains')(humanMove.defeats, robotMove.id);

            if ( humanWin ) {
               this.roundWinner = 'human';
               this.infoText = 'You win! ' + humanMove.name + ' ' + humanWin.verb + ' ' + humanWin.id + '.';
            } else {
               var robotWin = $filter('arrayContains')(robotMove.defeats, humanMove.id);
               this.roundWinner = 'robot';
               this.infoText = 'Robot wins! ' + robotMove.name + ' ' + robotWin.verb + ' ' + robotWin.id + '.';
            }
         }

         return { winner: this.roundWinner, text: this.infoText };
      }
   }])

   // Create a general purpose filter for finding keys in objects
   .filter('arrayContains', function() {
      return function(input, id) {
         for (var i=0; i<input.length; i++) {
            if (input[i].id == id) {
               return input[i];
            }
         }
         return false;
      }
   })

   /**
    * Game
    */

   .controller('gameController', ['gameManager', '$scope', '$timeout', function(gameManager, $scope, $timeout) {
      this.game = gameManager;
      $scope.instructions = "Select your first move below:";
      $scope.firstMove = true;
      $scope.isActive = false;

      this.playMove = function(element){

         // Get player array
         $scope.players = this.game.getPlayerData();

         // Get score data
         $scope.scoreData = this.game.getScoreData();

         // Get each players' chosen move
         $scope.robotMove = this.game.getRobotMove();
         $scope.humanMove = this.game.getHumanMove();
         $scope.results = this.game.getWinner( $scope.humanMove, $scope.robotMove );

         // Clear the players' previous move choices
         angular.forEach( $scope.players, function( value, index ) {
            value.chosen = null;
         })

         // Trigger animation, get the winner, and update the score
         $scope.instructions = "One, two, three...";
         $scope.firstMove = false;
         $scope.isActive = true;

         $timeout( function(){
            $scope.isActive = false;

            angular.forEach( $scope.players, function( value, index ) {
               if ( value.id == 'human' ) {
                  value.chosen = $scope.humanMove.id;
               } else if ( value.id == 'robot' ) {
                  value.chosen = $scope.robotMove.id;
               }
            })

            if ( $scope.results.winner == 'tie' ) {
               $scope.scoreData.ties += 1;
            } else {
               if ( $scope.results.winner == 'human' ) {
                  $scope.scoreData.humanWins += 1;
               } else {
                  $scope.scoreData.robotWins += 1;
               }
            }
            $scope.instructions = $scope.results.text;

         }, 3000 );
      }
   }])

   /**
    * Players
    */

   .controller('playerController', ['gameManager', function(gameManager) {
      this.players = gameManager.getPlayerData();
   }])

   /**
    * Moves
    */

   .controller('moveController', ['gameManager', function(gameManager) {
      this.moves = gameManager.getMoveData();
   }])

   .directive('playerMoves', function() {
      return {
         restrict: 'E',
         templateUrl: 'game/moves.html',
         scope: true
      };
   })

   /**
    * Scores
    */

   .controller('scoreController', ['gameManager', function(gameManager) {
      this.scores = gameManager.getScoreData();
   }]);
