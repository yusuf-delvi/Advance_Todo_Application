let url = '/api/todos';

$(document).ready(function () {

  $.getJSON(url)
    .done((data) => {
      data.forEach((todo) => addList(todo))
    });

  // Create Todo
  $('#btn').click(createTodo)

  // Update Todo
  $('#ul').on('click', 'li', updateTodo)

  // Delete Todo
  $('#ul').on('click', 'span', deleteTodo)
})


// === === ===
function createTodo() {
  let name = $('#todoInput').val(),
    date = new Date($('#dateInput').val()),
    time = $('#timeInput').val();

  let obj = {
    name: name,
    reminder: {
      minute: time.slice(3, 5),
      hour: time.slice(0, 2),
      dayOfMonth: date.getDate(),
      month: date.getMonth() + 1,
      dayOfWeek: date.getDay()
    }
  }

  $.ajax({
      method: 'POST',
      url: url,
      data: obj
    })
    .done(data => {
      addList(data)

      $('#todoInput').val('')
      $('#dateInput').val('')
      $('#timeInput').val('')
    })
}

// === === ===
function updateTodo() {
  $.ajax({
      method: 'PUT',
      url: url,
      data: {
        todoId: $(this).data('id')
      }
    })
    .done(data => {
      if (data.completed) {
        $(this).addClass('done')
      } else {
        $(this).removeClass('done')
      }
    })
}

// === === ===
function deleteTodo(e) {
  e.stopPropagation();
  let id = $(this).parent().data('id');
  $.ajax({
      method: 'DELETE',
      url: url,
      data: {
        todoId: id
      }
    })
    .done(data => $(this).parent().remove())
}

// === === === === ===
//     FUNCTIONS
// === === === === ===
function addList(todo) {
  var li;
  if (todo.completed) {
    li = $(`<li class="done">${todo.name} -- <span id="dltSpan" class="fas fa-trash-alt"></span></li>`)
  } else {
    li = $(`<li>${todo.name}<span id="dltSpan" class="fas fa-trash-alt"></span></li>`)
  }
  li.data('id', todo._id)
  $('#ul').append(li)
}