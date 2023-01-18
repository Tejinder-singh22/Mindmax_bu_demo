import Student from "../model/studentsModel.js";
/**
 * Insertion of Student from form which was filled at first step (theme)
 * @param  [type] Student     [description]
 * @param  [type] currentShop [description]
 * @return [type]             [void]
 */
export default async function insertStudentsCreate(student, currentShop, shopId) {
  console.log(JSON.stringify(student));
  let mycustomer = new Student({
    shop_name: currentShop,
    shop_id: shopId,
    student_token: student.token,
    formData: student,
    serverRequestData: "server info",
    created_at: new Date(),
    updated_at: new Date(),
  });

  //validation
  const user = await Student.findOne({ student_token: student.token });
  if (user) {
    Student.findOneAndUpdate(
      { student_token: student.token },
      {
        formData: student,
        serverRequestData: "server info",
        updated_at: new Date(),
      },
      { new: true },
      (error, data) => {
        if (error) {
          console.log(error);
        } else {
          console.log("student updated successfully");
          console.log(data);
        }
      }
    );
  } else {
    try {
      console.log("new student inserted succesfully");
      // console.log(Student);
      mycustomer.save();
    } catch (error) {
      console.log(error);
    }
  }
}
