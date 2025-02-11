import React from 'react';

function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      

      {/* Main Content */}
      <main className="flex-grow">
        {/* Technologies Section */}
        <section className="py-12">
          <h2 className="text-center text-3xl font-semibold mb-8">Technologies We Use</h2>
          <div className="flex justify-center space-x-8">
            {[{
                src: "https://firebasestorage.googleapis.com/v0/b/infiniteconnect-19162.appspot.com/o/react-icon.png?alt=media&token=6129d2cf-9f5c-4089-9033-fa18697c965c",
                label: "React"
              },
              {
                src: "https://firebasestorage.googleapis.com/v0/b/infiniteconnect-19162.appspot.com/o/node-icon.png?alt=media&token=0a163481-b58c-4c97-82a1-7deee0312ba6",
                label: "Node.js"
              },
              {
                src: "https://firebasestorage.googleapis.com/v0/b/infiniteconnect-19162.appspot.com/o/mongodb-icon.png?alt=media&token=0616a988-7fd6-41b1-b81d-aaa30f2ac2b5",
                label: "MongoDB"
              },
              {
                src: "https://firebasestorage.googleapis.com/v0/b/infiniteconnect-19162.appspot.com/o/aws-icon.png?alt=media&token=2da799f8-164b-442c-afcc-a0534942c9a4",
                label: "AWS"
              },
              {
                src: "https://firebasestorage.googleapis.com/v0/b/infiniteconnect-19162.appspot.com/o/github-icon.png?alt=media&token=09ea7473-9dd6-4d44-b957-694742740d58",
                label: "GitHub"
              },
            ].map((tech, index) => (
              <div key={index} className="flex flex-col items-center">
                <img src={tech.src} alt={tech.label} className="w-16 h-16 mb-2" />
                <p>{tech.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Developed By Section */}
        <section className="py-12 bg-gray-50">
          <h2 className="text-center text-3xl font-semibold mb-8">Developed by</h2>
          <div className="flex overflow-x-auto justify-center gap-8">
            {["G.KRISHNA VAMSI", "G.SHYAM", "M.VICTOR PAUL", "K.AJAY", "M.CHANDRA"].map((name, index) => (
              <div key={index} className="bg-white p-6 rounded-lg space-y-4 shadow-lg w-64 flex flex-col justify-center items-start">
                <h3 className="text-xl font-semibold ml-4">{name}</h3>
                <p><strong>Institution:</strong><br /> Lakireddy Balireddy College of Engineering</p>
                <p><strong>Year:</strong> 3RD YEAR</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center bg-gray-200">
        <p>&copy; 2024 Social Media Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default AboutPage;
