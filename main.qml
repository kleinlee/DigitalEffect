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

    Frame {
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.top: parent.top
        anchors.margins: 10
        background: Rectangle {
            color : "transparent"
        }
        RowLayout {
            width: parent.width
            spacing: 10
//! [sliders]
            Label { text: "Mouth:" }
            RealSlider {
                id: mouthSlider
                from: 0.0
                to: 1.0
            }
            Label { text: "Ears and eyebrows:" }
            RealSlider {
                id: earSlider
                from: 0.0
                to: 1.0
            }
            Label { text: "Cubify:" }
            RealSlider {
                id: cubeSlider
                from: 0.0
                to: 1.0
            }
//! [sliders]
        }
        z:1
    }
    View3D {
        id: view
        anchors.fill: parent

        //! [eff1]
        Effect {
            id: eff1
            property real iTime: 0
//            property TextureInput tex: TextureInput {
//                id: qtLogo
//                texture: Texture { source: "qt_logo_rect.png" }
//            }

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

        Timer {
            id: timer1
            running: true
            triggeredOnStart: true
            interval: 16
            repeat: true
            onTriggered: {
                eff1.iTime += 0.016;
            }
        }

        environment: SceneEnvironment {
            clearColor: "black"
            backgroundMode: SceneEnvironment.Color
            effects: [eff1]
        }

        PerspectiveCamera {
            id: camera
            position.z: 3.0
            position.y: 0.75
            eulerRotation.x: -12
            clipNear: 1.0
            clipFar: 60.0
        }

        DirectionalLight {
            eulerRotation.x: -30
            eulerRotation.y: -70
        }

//        DirectionalLight {
//        }

        DirectionalLight {
            eulerRotation.x: 30
            eulerRotation.y: -70
        }

//! [morphtargets]
        MorphTarget {
            id: morphtarget0
            weight: mouthSlider.value
            attributes: MorphTarget.Position | MorphTarget.Normal
        }
        MorphTarget {
            id: morphtarget1
            weight: earSlider.value
            attributes: MorphTarget.Position | MorphTarget.Normal
        }
        MorphTarget {
            id: morphtarget2
            weight: cubeSlider.value
            attributes: MorphTarget.Position | MorphTarget.Normal
        }
//! [morphtargets]

//! [model]
        Model {
            source: "suzanne.mesh"
            morphTargets: [
                morphtarget0,
                morphtarget1,
                morphtarget2
            ]
            materials: PrincipledMaterial {
                baseColor: "#41fd52"
                roughness: 0.1
            }
            SequentialAnimation on eulerRotation.y {
                NumberAnimation { from: -45; to: 45; duration: 10000 }
                NumberAnimation { from: 45; to: -45; duration: 10000 }
                loops: Animation.Infinite
            }
        }
//! [model]
    }
}
