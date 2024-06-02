import Ship from "./ship";

const empty = "~";
const hit = "x";
const miss = "m";

const size = 10;

export {hit, miss};

export default class GameBoard {
    board = Array.from(Array(size), () => new Array(size).fill(empty));
    ships = new Map();
    #nextShipId = 0;

    #invalidCoords(coords) {
        return coords.x < 0 || coords.x > size || coords.y < 0 || coords.y > size;
    }

    #isOverlapping(start, end) {
        if (start.x === end.x) {
          for (let i = start.y; i <= end.y; i++) {
            if (this.board[i][start.x] !== EMPTY) {
              return true;
            }
          }
        } else {
          for (let i = start.x; i <= end.x; i++) {
            if (this.board[start.y][i] !== EMPTY) {
              return true;
            }
          }
        }
        return false;
    }

    areAllSunk() {
        return !this.ships.size;
    }

    place(start, end) {
        if (
            start.x < 0 ||
            end.x < 0 ||
            start.x >= size ||
            end.x >= size ||
            this.#isOverlapping(start, end)
        ) {
            return false;
        }

        if (start.x === end.x) {
            for (let i = start.y; i <= end.y; i++) {
                this.board[i][start.x] = this.#nextShipId;
            }
        } else {
            for (let i = start.x; i <= end.x; i++) {
                this.board[start.y][i] = this.#nextShipId;
            }
        }

        this.ships.set(
            this.#nextShipId,
            new Ship(Math.max(end.x - start.x, end.y - start.y) + 1),
        );

        this.#nextShipId += 1;

        return true;
    }

    attack(coords) {
        if (this.#invalidCoords(coords)) {
            return false;
        }

        const tile = this.getTile(coords);

        if (tile === hit || tile === miss) {
            return false;
        }

        if (isNaN(parseInt(tile))) {
            this.board[coords.y][coords.x] = MISS;
          } else {
            this.board[coords.y][coords.x] = HIT;
            const ship = this.ships.get(tile);
            ship.hit();
            if (ship.isSunk()) {
              this.ships.delete(tile);
            }
          }
          return true;
    }
    
    getTile(coords) {
        return this.board[coords.y][coords.x];
    }
}