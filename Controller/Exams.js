const jsonFilePath = "../Exam.json";
export async function loadExam() {
  try {
    const response = await fetch(jsonFilePath);
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    const data = await response.json();
    getTests(data);
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }

  function isSubset(array1, array2, key) {
    return array1.every((obj1) =>
      array2.some((obj2) => obj1[key] === obj2[key])
    );
  }

  function getTests(tests) {
    let Exams = JSON.parse(localStorage.getItem("tests")) || [];

    if (!isSubset(tests, Exams, "id")) {
      tests.forEach((test) => {
        Exams.push(test);
      });
      localStorage.setItem("tests", JSON.stringify(Exams));
    }
  }
}
