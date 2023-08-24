// !TABLE
setTimeout(() => {
  (function () {
    var tableHeaders = document.getElementsByClassName("c-table__header");
    var tableCells = document.getElementsByClassName("c-table__cell");
    var span = document.createElement("span");

    for (var i = 0; i < tableCells.length; i++) {
      span = document.createElement("span");
      span.classList.add("c-table__label");
      tableCells[i].prepend(span);
    }

    var tableLabels =
      tableHeaders[0].getElementsByClassName("c-table__col-label");
    var spanMod = document.getElementsByClassName("c-table__label");

    for (var i = 0; i < tableLabels.length; i++) {
      for (var a = 0; a < tableCells.length; a++) {
        spanMod[a].innerHTML = tableLabels[i].innerHTML;
      }
    }

    var b = tableLabels.length;
    for (var a = 0; a < tableCells.length; a++) {
      spanMod[a].innerHTML = tableLabels[a % b].innerHTML;
    }
  })();
}, 100);
