import QtQuick
import QtQuick3D
import QtQuick.Controls
import QtQuick.Layouts
import QtQuick3D.Effects
Window {
    id: window
    visible: true
    width:  800
    height: 800
    title: qsTr("Morphing Example")

    View3D {
        id: view
        anchors.fill: parent

        //! [eff1]
        Effect {
            id: eff1
            property real iTime: 1.0
            property TextureInput tex: TextureInput {
                id: qtLogo
                texture: Texture { source: "qrc:/channel.png" }
            }

            Shader {
                id: vs1
                stage: Shader.Vertex
                shader: "effect2.vert"
            }
            Shader {
                id: fs1
                stage: Shader.Fragment
                shader: "effect4.frag"
            }
            passes: Pass {
                shaders: [ vs1, fs1 ]
            }
        }
        //! [eff1]

        environment: SceneEnvironment {
            clearColor: "black"
            backgroundMode: SceneEnvironment.Color
            effects: [eff1]
        }

        PerspectiveCamera {
            id: camera
            position: Qt.vector3d(0,-80,150)
            eulerRotation.x: 90
        }

        DirectionalLight {
            eulerRotation.x: -30
            eulerRotation.y: -70
        }
        DirectionalLight {
        }
        DirectionalLight {
            eulerRotation.x: 30
            eulerRotation.y: -70
        }

        ThirdPersonWalk {

        }
    }
}
