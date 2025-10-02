type Position = [number, number]; // Тип для координат ячейки

interface ClusterFinderOptions {
  minClusterSize?: number; // Минимальный размер кластера
  includeDiagonals?: boolean; // Учитывать диагональные соседи
}

export class ClusterFinderDFS {
  private matrix: number[][];
  private rows: number;
  private cols: number;
  private visited: boolean[][];
  private clusters: Position[][];
  private minClusterSize: number;
  private includeDiagonals: boolean;

  constructor(matrix: number[][], options: ClusterFinderOptions = {}) {
    this.matrix = matrix;
    this.rows = matrix.length;
    this.cols = matrix[0].length;
    this.visited = Array(this.rows)
      .fill(null)
      .map(() => Array(this.cols).fill(false));
    this.clusters = [];
    this.minClusterSize = options.minClusterSize ?? 1; // По умолчанию 1
    this.includeDiagonals = options.includeDiagonals ?? true; // По умолчанию true
  }

  /**
   * Находит все кластеры в матрице
   * @returns Массив кластеров, где каждый кластер - массив координат [i, j]
   */
  public findClusters(): Position[][] {
    this.clusters = []; // Сбрасываем предыдущие кластеры
    this.visited = Array(this.rows)
      .fill(null)
      .map(() => Array(this.cols).fill(false)); // Сбрасываем посещенные ячейки

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (!this.visited[i][j]) {
          const cluster: Position[] = [];
          this.dfs(i, j, this.matrix[i][j], cluster);

          // Добавляем кластер только если его размер больше минимального
          if (cluster.length >= this.minClusterSize) {
            this.clusters.push(cluster);
          }
        }
      }
    }
    return this.clusters;
  }

  /**
   * Рекурсивный метод DFS для поиска кластера
   * @param i - индекс строки
   * @param j - индекс столбца
   * @param value - значение ячейки, которое ищем
   * @param cluster - массив координат ячеек кластера
   */
  private dfs(i: number, j: number, value: number, cluster: Position[]): void {
    // Проверяем границы матрицы, посещенность и значение ячейки
    if (
      i < 0 ||
      i >= this.rows ||
      j < 0 ||
      j >= this.cols ||
      this.visited[i][j] ||
      this.matrix[i][j] !== value
    ) {
      return;
    }

    // Помечаем ячейку как посещенную
    this.visited[i][j] = true;
    // Добавляем координаты ячейки в кластер
    cluster.push([i, j]);

    // Направления для соседних ячеек
    const directions: Position[] = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1], // Соседи по горизонтали и вертикали
    ];

    // Добавляем диагональные соседи, если нужно
    if (this.includeDiagonals) {
      directions.push([-1, -1], [-1, 1], [1, -1], [1, 1]);
    }

    // Рекурсивно обходим все соседние ячейки
    for (const [di, dj] of directions) {
      this.dfs(i + di, j + dj, value, cluster);
    }
  }

  /**
   * Визуализация кластеров (возвращает матрицу с номерами кластеров)
   * @returns Матрица с номерами кластеров
   */
  public visualizeClusters(): number[][] {
    const visualized: number[][] = Array(this.rows)
      .fill(null)
      .map(() => Array(this.cols).fill(0));

    // Проходим по всем кластерам и присваиваем уникальные номера
    for (let i = 0; i < this.clusters.length; i++) {
      const cluster = this.clusters[i];
      for (const [row, col] of cluster) {
        visualized[row][col] = i + 1; // Номер кластера
      }
    }

    return visualized;
  }

  /**
   * Получает кластеры сгруппированные по значениям
   * @returns Map, где ключ - значение ячейки, а значение - массив кластеров
   */
  public getClustersByValue(): Map<number, Position[][]> {
    const clustersByValue = new Map<number, Position[][]>();

    for (const cluster of this.clusters) {
      const value = this.matrix[cluster[0][0]][cluster[0][1]]; // Значение первой ячейки кластера
      if (!clustersByValue.has(value)) {
        clustersByValue.set(value, []);
      }
      clustersByValue.get(value)?.push(cluster);
    }

    return clustersByValue;
  }
}
