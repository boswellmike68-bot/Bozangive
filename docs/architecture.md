flowchart TD

    %% Foundation Layer
    subgraph Foundation["Foundation Layer"]
        A1[.gitignore]
        A2[LICENSE]
        A3[README.md]
    end

    %% Configuration Layer
    subgraph Config["Configuration Layer"]
        B1[config/repos.json]
    end

    %% Core Logic Layer
    subgraph Core["Core Logic Layer"]
        C1[core/taskRouter.js]
    end

    %% Integration Layer
    subgraph Integration["Integration Layer"]
        D1[integration/uiAdapter.js]
    end

    %% GitHub Processing Layer
    subgraph GitHub["GitHub Processing Layer"]
        E1[github/summaryGenerator.js]
    end

    %% Reporting Layer
    subgraph Reports["Reporting & Mapping Layer"]
        F1[reports/systemMapGenerator.js]
    end

    %% Data Flow
    D1 --> C1
    C1 --> E1
    C1 --> F1
    B1 --> C1
