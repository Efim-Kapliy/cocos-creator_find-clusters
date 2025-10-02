# cocos-creator_find-clusters

This project is a Cocos Creator game that identifies and visually marks clusters of blocks with the same color in a grid. The grid dimensions, number of color schemes, and minimum cluster size are configurable.

## Features and Functionality

*   **Dynamic Grid Generation:** Generates a grid of colored blocks based on user-defined dimensions (M x N).
*   **Configurable Color Schemes:**  Allows specifying the number of color schemes (X) to be used for the blocks.
*   **Cluster Detection:** Uses a Depth-First Search (DFS) algorithm to find clusters of adjacent blocks with the same color.
*   **Minimum Cluster Size:** Configurable minimum size (Y) for clusters to be identified. Clusters smaller than this size are ignored.
*   **Visual Marking:**  Highlights detected clusters with a scaling animation, differentiating them from regular blocks.
*   **Editor-time Preview:** The grid and cluster highlighting can be previewed within the Cocos Creator editor.
*   **Input fields:** Allows users to change the parameters of the grid (M, N, X, Y).

## Technology Stack

*   **Cocos Creator:**  Game engine used for development.
*   **TypeScript:** Programming language used for scripting.
*   **Depth-First Search (DFS):** Algorithm for cluster detection implemented in `assets/Scripts/utils/ClusterFinderDFS.ts`.

## Prerequisites

*   Cocos Creator 3.0 or higher installed.
*   Basic knowledge of Cocos Creator and TypeScript.

## Installation Instructions

1.  Clone the repository:
    ```bash
    git clone https://github.com/Efim-Kapliy/cocos-creator_find-clusters.git
    ```
2.  Open the project in Cocos Creator.
3.  Ensure all the necessary modules are installed in Cocos Creator.

## Usage Guide

1.  **Open the Scene:**  Open the main scene in the Cocos Creator editor.
2.  **Configure the Game Manager:** Select the `GameManager` node in the scene hierarchy.
3.  **Adjust Parameters:** In the Inspector panel, you can adjust the following parameters:
    *   `M`: Width of the grid (number of columns).
    *   `N`: Height of the grid (number of rows).
    *   `X`: Number of color schemes for the blocks.
    *   `Y`: Minimum size of clusters to be highlighted.
    *   `blockPrefab`: The prefab to use for generating the blocks.  This should be set to your block prefab.
4.  **Run the Scene:**  Press the "Play" button in Cocos Creator to run the scene.
5.  **Marked Blocks Manager:** Select the `MarkedBlocksManager` node in the scene hierarchy.
    *   `blockPrefab`: The prefab to use for marking the blocks. This should be set to your block prefab with marked animation.
6.  **EditBox usage:** Use EditBox controls for changing the M, N, X, and Y parameters. Press Submit button to apply new parameters.

## Code Structure

*   `assets/Scripts/GameControls.ts`: Handles user input through `EditBox` components and sends updated parameters to the `GameManager`.
*   `assets/Scripts/GameManager.ts`:  Generates the grid of blocks, manages game state, and handles parameter updates.  The core logic for creating the block field resides here.  Uses `SeededRandom` for predictable random generation. Uses the `BlockFactory` to instantiate block prefabs.
*   `assets/Scripts/MarkedBlocksManager.ts`:  Detects clusters using `ClusterFinderDFS` and visually marks them on the grid using the `BlockFactory`.
*   `assets/Scripts/blocks/`: Contains scripts related to block creation and management.
    *   `Block.ts`: Abstract base class for blocks.
    *   `BlockFactory.ts`:  Factory class for creating different types of blocks (simple and marked).
    *   `SimpleBlock.ts`:  Implementation of a simple block.
    *   `MarkedBlock.ts`:  Implementation of a marked block with a scaling animation.
*   `assets/Scripts/utils/`: Contains utility classes.
    *   `ClusterFinderDFS.ts`:  Implements the Depth-First Search algorithm for finding clusters. Configurable options for `minClusterSize` and `includeDiagonals`.
    *   `RandomColorGenerator.ts`: Generates a set of random colors.
    *   `SeededRandom.ts`:  Provides a seeded random number generator for predictable results.
*   `assets/Scripts/types/`: Contains type definitions.
    *   `blocks.ts`: Defines `ColorType` as `number[]`.

## API Documentation

*   **`GameManager.addScore(AddScoreType)`:** Updates the grid parameters (M, N, X, Y) and triggers a rerender of the grid.
    *   `AddScoreType`: An object with the following properties:
        *   `M`: Number (grid width).
        *   `N`: Number (grid height).
        *   `X`: Number (color schemes).
        *   `Y`: Minimum cluster size.
*   **`ClusterFinderDFS.findClusters()`:**  Finds all clusters in the grid that meet the minimum size requirement.  Returns a `Position[][]`, where each `Position[]` is a cluster and each `Position` is a `[row, col]` coordinate within the grid.
*   **`BlockFactory.createBlock(CreateBlockType)`:** Creates a block based on the specified type and parameters.
    * `CreateBlockType`:
        *   `blockType`: "simple" | "marked"
        *   `prefab`: Prefab
        *   `parent`: Node
        *   `positionX`: number
        *   `positionY`: number
        *   `colorRGB`: ColorType

## Contributing Guidelines

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with descriptive messages.
4.  Submit a pull request.

## License Information

License not specified.

## Contact/Support Information

For questions or support, please contact [Efim-Kapliy](https://github.com/Efim-Kapliy) via GitHub.